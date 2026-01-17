import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { Council } from '../value-objects/council';
import type { Profession } from '../value-objects/profession';
export interface ProfessionalProps {
    franchiseId: UniqueEntityId;
    userId: UniqueEntityId;
    council: Council;
    councilNumber: string;
    councilState: string;
    profession: Profession;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Professional extends Entity<ProfessionalProps> {
    static create(props: Optional<ProfessionalProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): Professional;
    get franchiseId(): UniqueEntityId;
    get userId(): UniqueEntityId;
    get council(): Council;
    get councilNumber(): string;
    get councilState(): string;
    get profession(): Profession;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set franchiseId(franchiseId: UniqueEntityId);
    set userId(userId: UniqueEntityId);
    set council(council: Council);
    set councilNumber(councilNumber: string);
    set councilState(councilState: string);
    set profession(profession: Profession);
    set updatedAt(updatedAt: Date);
}
