export class AnamnesisTokenRequestedEvent {
  constructor(
    public readonly patientId: string,
    public readonly clinicId: string,
    public readonly patientEmail: string,
    public readonly patientPhone: string | undefined,
    public readonly patientName: string,
  ) {}
}
