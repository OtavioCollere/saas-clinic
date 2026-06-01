export class AppointmentCancelledEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientName: string,
    public readonly patientEmail: string,
    public readonly appointmentName: string,
    public readonly startAt: Date,
    public readonly patientPhone?: string,
    public readonly professionalName?: string,
    public readonly address?: string,
  ) {}
}
