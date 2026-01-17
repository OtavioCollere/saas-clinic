import { FranchiseStatus } from '../value-objects/franchise-status';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
export interface FranchiseProps {
    clinicId: UniqueEntityId;
    name: string;
    address: string;
    zipCode: string;
    status: FranchiseStatus;
    description?: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Franchise extends Entity<FranchiseProps> {
    static create(props: Optional<FranchiseProps, "createdAt" | "updatedAt">, id?: UniqueEntityId): Franchise;
    get clinicId(): UniqueEntityId;
    get name(): string;
    get address(): string;
    get zipCode(): string;
    get status(): FranchiseStatus;
    get description(): string | undefined;
    get createdAt(): Date;
    set clinicId(clinicId: UniqueEntityId);
    set name(name: string);
    set address(address: string);
    set zipCode(zipCode: string);
    set status(status: FranchiseStatus);
    set description(description: string | undefined);
    set updatedAt(updatedAt: Date);
}
