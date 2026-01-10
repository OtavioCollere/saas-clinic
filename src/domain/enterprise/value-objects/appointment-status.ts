import { DomainError } from "../../../core/errors/domain-error"


export type AppointmentStatusType =
  | 'WAITING'
  | 'CONFIRMED'
  | 'DONE'
  | 'CANCELED'

export class AppointmentStatus {
  private constructor(
    private readonly value: AppointmentStatusType
  ) {}

  // estados iniciais / finais
  static waiting() {
    return new AppointmentStatus('WAITING')
  }

  static confirmed() {
    return new AppointmentStatus('CONFIRMED')
  }

  static done() {
    return new AppointmentStatus('DONE')
  }

  static canceled() {
    return new AppointmentStatus('CANCELED')
  }

  // queries
  isWaiting(): boolean {
    return this.value === 'WAITING'
  }

  isConfirmed(): boolean {
    return this.value === 'CONFIRMED'
  }

  isDone(): boolean {
    return this.value === 'DONE'
  }

  isCanceled(): boolean {
    return this.value === 'CANCELED'
  }

  getValue(): AppointmentStatusType {
    return this.value
  }

  // transitions (regra de negócio)
  confirm(): AppointmentStatus {
    if (!this.isWaiting()) {
      throw new DomainError(
        'Only waiting appointments can be confirmed'
      )
    }

    return AppointmentStatus.confirmed()
  }

  cancel(): AppointmentStatus {
    if (this.isDone()) {
      throw new DomainError(
        'Done appointments cannot be canceled'
      )
    }

    if (this.isCanceled()) {
      throw new DomainError(
        'Appointment is already canceled'
      )
    }

    return AppointmentStatus.canceled()
  }

  finish(): AppointmentStatus {
    if (!this.isConfirmed()) {
      throw new DomainError(
        'Only confirmed appointments can be finished'
      )
    }

    return AppointmentStatus.done()
  }
}
