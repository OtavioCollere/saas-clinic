import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ClinicRepository } from "@/domain/application/repositories/clinic-repository";
import { ProfessionalRepository } from "@/domain/application/repositories/professional-repository";
import { ProcedureRepository } from "@/domain/application/repositories/procedure-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { PatientRepository } from "@/domain/application/repositories/patient-repository";
import { CreateAppointmentUseCase } from "@/domain/application/use-cases/appointment/create-appointment";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { AppointmentItem } from "@/domain/enterprise/entities/appointment-item";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

const lookupBodySchema = z.object({
  cpf: z.string().min(11),
});

const bookBodySchema = z.object({
  patientId: z.string(),
  professionalId: z.string(),
  franchiseId: z.string(),
  procedureId: z.string(),
  price: z.number(),
  startAt: z.string().datetime(),
  durationInMinutes: z.number().int().positive(),
  notes: z.string().optional(),
});

type LookupBody = z.infer<typeof lookupBodySchema>;
type BookBody = z.infer<typeof bookBodySchema>;

const lookupPipe = new ZodValidationPipe(lookupBodySchema);
const bookPipe = new ZodValidationPipe(bookBodySchema);

@ApiTags("Public Booking")
@Controller("/booking")
export class PublicBookingController {
  constructor(
    @Inject(ClinicRepository)
    private clinicRepo: ClinicRepository,
    @Inject(ProfessionalRepository)
    private professionalRepo: ProfessionalRepository,
    @Inject(ProcedureRepository)
    private procedureRepo: ProcedureRepository,
    @Inject(UsersRepository)
    private usersRepo: UsersRepository,
    @Inject(PatientRepository)
    private patientRepo: PatientRepository,
    @Inject(CreateAppointmentUseCase)
    private createAppointmentUseCase: CreateAppointmentUseCase,
  ) {}

  @Get(":slug")
  @Public()
  @ApiOperation({ summary: "Get clinic booking info (public)" })
  async getClinicInfo(@Param("slug") slug: string) {
    const clinic = await this.clinicRepo.findBySlug(slug);
    if (!clinic) throw new NotFoundException("Clínica não encontrada");

    const clinicId = clinic.id.toString();

    const [professionals, procedures] = await Promise.all([
      this.professionalRepo.findByClinicId(clinicId),
      this.procedureRepo.findByClinicId(clinicId),
    ]);

    const userIds = [...new Set(professionals.map((p) => p.userId.toString()))];
    const users = await Promise.all(userIds.map((id) => this.usersRepo.findById(id)));
    const usersMap = new Map(users.filter(Boolean).map((u) => [u!.id.toString(), u!]));

    return {
      clinic: { id: clinicId, name: clinic.name },
      professionals: professionals.map((p) => {
        const user = usersMap.get(p.userId.toString());
        return {
          id: p.id.toString(),
          name: user?.name ?? "Profissional",
          profession: p.profession.getValue(),
          franchiseId: p.franchiseId.toString(),
        };
      }),
      procedures: procedures.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        price: p.price,
        franchiseId: p.franchiseId.toString(),
      })),
    };
  }

  @Post(":slug/lookup")
  @Public()
  @ApiOperation({ summary: "Find patient by CPF (public)" })
  async lookupPatient(
    @Param("slug") slug: string,
    @Body(lookupPipe) body: LookupBody,
  ) {
    const clinic = await this.clinicRepo.findBySlug(slug);
    if (!clinic) throw new NotFoundException("Clínica não encontrada");

    const cpfClean = body.cpf.replace(/\D/g, "");
    const user = await this.usersRepo.findByCpf(cpfClean);
    if (!user) throw new NotFoundException("Paciente não encontrado para este CPF");

    const patient = await this.patientRepo.findByUserIdAndClinicId(
      user.id.toString(),
      clinic.id.toString(),
    );
    if (!patient) throw new NotFoundException("Paciente não cadastrado nesta clínica");

    return { id: patient.id.toString(), name: patient.name ?? user.name ?? "Paciente" };
  }

  @Post(":slug/appointments")
  @Public()
  @ApiOperation({ summary: "Create appointment (public)" })
  async createAppointment(
    @Param("slug") slug: string,
    @Body(bookPipe) body: BookBody,
  ) {
    const clinic = await this.clinicRepo.findBySlug(slug);
    if (!clinic) throw new NotFoundException("Clínica não encontrada");

    const { patientId, professionalId, franchiseId, procedureId, price, startAt, durationInMinutes, notes } = body;

    const item = AppointmentItem.create({
      procedureId: new UniqueEntityId(procedureId),
      price,
      notes,
    });

    const result = await this.createAppointmentUseCase.execute({
      professionalId,
      franchiseId,
      patientId,
      name: "Agendamento online",
      appointmentItems: [item],
      startAt: new Date(startAt),
      durationInMinutes,
    });

    if (isLeft(result)) {
      throw new BadRequestException(unwrapEither(result).message);
    }

    return { success: true, appointmentId: unwrapEither(result).appointment.id.toString() };
  }
}
