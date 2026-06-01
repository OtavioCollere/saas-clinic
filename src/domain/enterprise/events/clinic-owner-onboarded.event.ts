export class ClinicOwnerOnboardedEvent {
  constructor(
    public readonly userId: string,
    public readonly clinicId: string,
    public readonly clinicName: string,
    public readonly clinicSlug: string,
    public readonly ownerEmail: string,
    public readonly password: string,
    public readonly expiresAt: Date,
  ) {}
}
