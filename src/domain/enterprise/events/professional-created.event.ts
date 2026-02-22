export class ProfessionalCreatedEvent {
  constructor(
    public readonly professionalId: string,
    public readonly userId: string,
    public readonly franchiseId: string,
    public readonly clinicSlug: string,
    public readonly userEmail: string,
  ) {}
}
