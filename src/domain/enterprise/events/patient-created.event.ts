export class PatientCreatedEvent {
  constructor(
    public readonly patientId: string,
    public readonly userId: string,
    public readonly clinicId: string,
    public readonly clinicSlug: string,
    public readonly userEmail: string,
  ) {}
}


