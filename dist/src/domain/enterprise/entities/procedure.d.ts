import { ProcedureStatus } from '../value-objects/procedure-status';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
export interface ProcedureProps {
    franchiseId: UniqueEntityId;
    name: string;
    price: number;
    notes?: string;
    status: ProcedureStatus;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Procedure extends Entity<ProcedureProps> {
    static create(props: Optional<ProcedureProps, "createdAt" | "updatedAt">, id?: UniqueEntityId): Procedure;
    get franchiseId(): UniqueEntityId;
    get name(): string;
    get price(): number;
    get notes(): string | undefined;
    get status(): ProcedureStatus;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set franchiseId(franchiseId: UniqueEntityId);
    set name(name: string);
    set price(price: number);
    set notes(notes: string | undefined);
    set status(status: ProcedureStatus);
    set updatedAt(updatedAt: Date);
}
