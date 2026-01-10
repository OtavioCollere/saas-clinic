import type { ClinicMembership } from '@/domain/enterprise/entities/clinic-membership';

export abstract class ClinicMembershipRepository {
  abstract findByUserAndClinic(userId: string, clinicId: string): Promise<ClinicMembership | null>;
  abstract create(membership: ClinicMembership): Promise<ClinicMembership>;
}

