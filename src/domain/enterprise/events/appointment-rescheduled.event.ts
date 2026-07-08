export class AppointmentRescheduledEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientName: string,
    public readonly patientEmail: string,
    public readonly appointmentName: string,
    public readonly newStartAt: Date,
    public readonly oldStartAt: Date,
    public readonly clinicId: string,
    public readonly patientPhone?: string,
    public readonly professionalName?: string,
    public readonly address?: string,
  ) {}
}
