import type { ClinicMembershipRepository } from '../../src/domain/application/repositories/clinic-membership-repository';
import type { ClinicMembership } from '../../src/domain/enterprise/entities/clinic-membership';

export class InMemoryClinicMembershipRepository implements ClinicMembershipRepository {
  public items: ClinicMembership[] = [];

  async findByUserAndClinic(userId: string, clinicId: string): Promise<ClinicMembership | null> {
    const membership = this.items.find(
      (item) =>
        item.userId.toString() === userId && item.clinicId.toString() === clinicId
    );

    if (!membership) return null;

    return membership;
  }

  async create(membership: ClinicMembership): Promise<ClinicMembership> {
    this.items.push(membership);
    return membership;
  }
}

