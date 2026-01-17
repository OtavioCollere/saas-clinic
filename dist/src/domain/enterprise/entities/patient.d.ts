import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { Anamnesis } from './anamnesis/anamnesis';
export interface PatientProps {
    clinicId: UniqueEntityId;
    userId: UniqueEntityId;
    anamnesis: Anamnesis;
    name: string;
    birthDay: Date;
    address: string;
    zipCode: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Patient extends Entity<PatientProps> {
    static create(props: Optional<PatientProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): Patient;
    get clinicId(): UniqueEntityId;
    get userId(): UniqueEntityId;
    get anamnesis(): Anamnesis;
    get name(): string;
    get birthDay(): Date;
    get address(): string;
    get zipCode(): string;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set clinicId(clinicId: UniqueEntityId);
    set userId(userId: UniqueEntityId);
    set anamnesis(anamnesis: Anamnesis);
    set name(name: string);
    set birthDay(birthDay: Date);
    set address(address: string);
    set zipCode(zipCode: string);
    set updatedAt(updatedAt: Date);
}
