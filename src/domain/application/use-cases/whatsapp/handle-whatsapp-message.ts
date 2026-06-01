import { Inject, Injectable } from '@nestjs/common'
import { isLeft } from '@/shared/either/either'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import { FranchiseRepository } from '../../repositories/franchise-repository'
import { WhatsAppConversationRepository } from '../../repositories/whatsapp-conversation-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { PatientRepository } from '../../repositories/patient-repository'
import { ProfessionalRepository } from '../../repositories/professional-repository'
import { AppointmentsRepository } from '../../repositories/appointments-repository'
import { WhatsAppConversation } from '@/domain/enterprise/entities/whatsapp-conversation'
import { ConversationStep } from '@/domain/enterprise/value-objects/conversation-step'
import { WhatsAppSender } from '@/shared/services/whatsapp/whatsapp-sender'
import { CreateAppointmentUseCase } from '../appointment/create-appointment'

interface HandleWhatsAppMessageUseCaseRequest {
  franchiseId: string
  fromPhone: string
  message: string
}

const DURATION_IN_MINUTES = 15

@Injectable()
export class HandleWhatsAppMessageUseCase {
  constructor(
    @Inject(FranchiseRepository)
    private franchiseRepository: FranchiseRepository,
    @Inject(WhatsAppConversationRepository)
    private conversationRepository: WhatsAppConversationRepository,
    @Inject(UsersRepository)
    private usersRepository: UsersRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(CreateAppointmentUseCase)
    private createAppointmentUseCase: CreateAppointmentUseCase,
    @Inject(WhatsAppSender)
    private whatsAppSender: WhatsAppSender,
  ) {}

  async execute({ franchiseId, fromPhone, message }: HandleWhatsAppMessageUseCaseRequest): Promise<void> {
    const franchise = await this.franchiseRepository.findById(franchiseId)
    if (!franchise) return

    let conversation = await this.conversationRepository.findByPhoneNumberAndFranchiseId(fromPhone, franchiseId)

    if (conversation?.isExpired()) {
      await this.conversationRepository.delete(fromPhone, franchiseId)
      await this.whatsAppSender.send({
        to: fromPhone,
        message: 'Sua sessão expirou. Envie qualquer mensagem para recomeçar.',
      })
      conversation = null
    }

    if (!conversation) {
      conversation = WhatsAppConversation.create({
        phoneNumber: fromPhone,
        franchiseId: new UniqueEntityId(franchiseId),
      })
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: fromPhone,
        message: `Olá! Bem-vindo ao agendamento online.\n\nPor favor, informe seu *CPF* (somente números):`,
      })
      return
    }

    conversation.refreshExpiry()

    if (conversation.step.isAwaitingCpf()) {
      await this.handleAwaitingCpf(conversation, franchise.clinicId.toString(), message)
      return
    }

    if (conversation.step.isAwaitingProfessional()) {
      await this.handleAwaitingProfessional(conversation, franchiseId, message)
      return
    }

    if (conversation.step.isAwaitingDate()) {
      await this.handleAwaitingDate(conversation, message)
      return
    }

    if (conversation.step.isAwaitingTime()) {
      await this.handleAwaitingTime(conversation, message)
      return
    }

    if (conversation.step.isAwaitingConfirmation()) {
      await this.handleAwaitingConfirmation(conversation, franchiseId, message)
    }
  }

  private async handleAwaitingCpf(conversation: WhatsAppConversation, clinicId: string, message: string) {
    const cpf = message.replace(/\D/g, '')

    const user = await this.usersRepository.findByCpf(cpf)
    if (!user) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'CPF não encontrado. Verifique e tente novamente:',
      })
      return
    }

    const patient = await this.patientRepository.findByUserIdAndClinicId(user.id.toString(), clinicId)
    if (!patient) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Paciente não encontrado nesta unidade. Entre em contato com a recepção.',
      })
      return
    }

    const professionals = await this.professionalRepository.findByFranchiseId(conversation.franchiseId.toString())
    if (professionals.length === 0) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Não há profissionais disponíveis no momento. Entre em contato com a recepção.',
      })
      return
    }

    const professionalNames = await Promise.all(
      professionals.map((p) => this.usersRepository.findById(p.userId.toString())),
    )

    const list = professionals
      .map((_, i) => `*${i + 1}.* ${professionalNames[i]?.name ?? 'Profissional'}`)
      .join('\n')

    conversation.patientId = patient.id
    conversation.step = ConversationStep.awaitingProfessional()
    await this.conversationRepository.save(conversation)

    await this.whatsAppSender.send({
      to: conversation.phoneNumber,
      message: `Olá, *${patient.name}*! Escolha o profissional:\n\n${list}\n\nResponda com o número:`,
    })
  }

  private async handleAwaitingProfessional(conversation: WhatsAppConversation, franchiseId: string, message: string) {
    const choice = parseInt(message.trim(), 10)
    const professionals = await this.professionalRepository.findByFranchiseId(franchiseId)

    if (isNaN(choice) || choice < 1 || choice > professionals.length) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: `Opção inválida. Responda com um número de 1 a ${professionals.length}:`,
      })
      return
    }

    const professional = professionals[choice - 1]
    conversation.professionalId = professional.id
    conversation.step = ConversationStep.awaitingDate()
    await this.conversationRepository.save(conversation)

    await this.whatsAppSender.send({
      to: conversation.phoneNumber,
      message: 'Qual a data da consulta?\n\nResponda no formato *DD/MM/AAAA* (ex: 25/05/2026):',
    })
  }

  private async handleAwaitingDate(conversation: WhatsAppConversation, message: string) {
    const parsed = this.parseDate(message.trim())

    if (!parsed) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Data inválida. Use o formato *DD/MM/AAAA* (ex: 25/05/2026):',
      })
      return
    }

    if (parsed < new Date()) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'A data precisa ser futura. Tente novamente:',
      })
      return
    }

    conversation.selectedDate = parsed
    conversation.step = ConversationStep.awaitingTime()
    await this.conversationRepository.save(conversation)

    await this.whatsAppSender.send({
      to: conversation.phoneNumber,
      message: 'Qual o horário?\n\nAtendemos das *07:00 às 21:00*. Responda no formato *HH:MM* (ex: 14:30):',
    })
  }

  private async handleAwaitingTime(conversation: WhatsAppConversation, message: string) {
    const time = this.parseTime(message.trim())

    if (!time) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Horário inválido. Use o formato *HH:MM* (ex: 14:30):',
      })
      return
    }

    const { hours, minutes } = time

    if (hours < 7 || hours > 21 || (hours === 21 && minutes > 0)) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Horário fora do período de atendimento (07:00 às 21:00). Tente outro horário:',
      })
      return
    }

    const startAt = new Date(conversation.selectedDate!)
    startAt.setHours(hours, minutes, 0, 0)
    const endAt = new Date(startAt.getTime() + DURATION_IN_MINUTES * 60 * 1000)

    const conflict = await this.appointmentsRepository.findByProfessionalIdAndHourRange(
      conversation.professionalId!.toString(),
      startAt,
      endAt,
    )

    if (conflict) {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Este horário já está ocupado. Escolha outro horário:',
      })
      return
    }

    const professional = await this.professionalRepository.findById(conversation.professionalId!.toString())
    const professionalUser = professional
      ? await this.usersRepository.findById(professional.userId.toString())
      : null
    const dateStr = startAt.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    conversation.selectedDate = startAt
    conversation.step = ConversationStep.awaitingConfirmation()
    await this.conversationRepository.save(conversation)

    await this.whatsAppSender.send({
      to: conversation.phoneNumber,
      message: `Confirme o agendamento:\n\n📅 *${dateStr}*\n🕐 *${timeStr}*\n👤 *${professionalUser?.name ?? 'Profissional'}*\n⏱ *15 minutos*\n\nResponda *SIM* para confirmar ou *NÃO* para cancelar:`,
    })
  }

  private async handleAwaitingConfirmation(conversation: WhatsAppConversation, franchiseId: string, message: string) {
    const normalized = message.trim().toUpperCase()

    if (normalized === 'NÃO' || normalized === 'NAO') {
      await this.conversationRepository.delete(conversation.phoneNumber, franchiseId)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Agendamento cancelado. Envie qualquer mensagem para recomeçar.',
      })
      return
    }

    if (normalized !== 'SIM') {
      await this.conversationRepository.save(conversation)
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Responda *SIM* para confirmar ou *NÃO* para cancelar:',
      })
      return
    }

    const patient = await this.patientRepository.findById(conversation.patientId!.toString())
    const appointmentName = `Consulta - ${patient?.name ?? 'Paciente'}`

    const result = await this.createAppointmentUseCase.execute({
      franchiseId,
      patientId: conversation.patientId!.toString(),
      professionalId: conversation.professionalId!.toString(),
      name: appointmentName,
      appointmentItems: [],
      startAt: conversation.selectedDate!,
      durationInMinutes: DURATION_IN_MINUTES,
    })

    await this.conversationRepository.delete(conversation.phoneNumber, franchiseId)

    if (isLeft(result)) {
      await this.whatsAppSender.send({
        to: conversation.phoneNumber,
        message: 'Não foi possível realizar o agendamento. Por favor, entre em contato com a recepção.',
      })
      return
    }

    await this.whatsAppSender.send({
      to: conversation.phoneNumber,
      message: '✅ *Consulta agendada com sucesso!*\n\nVocê receberá um lembrete no dia anterior. Até logo!',
    })
  }

  private parseDate(input: string): Date | null {
    const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!match) return null
    const [, day, month, year] = match
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (isNaN(date.getTime())) return null
    if (date.getDate() !== Number(day)) return null
    return date
  }

  private parseTime(input: string): { hours: number; minutes: number } | null {
    const match = input.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return null
    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
    return { hours, minutes }
  }
}
