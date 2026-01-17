import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ClinicRole } from '../value-objects/clinic-role';
export interface ClinicMembershipProps {
    userId: UniqueEntityId;
    clinicId: UniqueEntityId;
    role: ClinicRole;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class ClinicMembership extends Entity<ClinicMembershipProps> {
    static create(props: Optional<ClinicMembershipProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): ClinicMembership;
    get userId(): UniqueEntityId;
    get clinicId(): UniqueEntityId;
    get role(): ClinicRole;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set userId(userId: UniqueEntityId);
    set clinicId(clinicId: UniqueEntityId);
    set role(role: ClinicRole);
    set updatedAt(updatedAt: Date);
}
