export class StaffMemberCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly clinicId: string,
    public readonly userEmail: string,
    public readonly password: string,
    public readonly expiresAt: Date,
  ) {}
}
