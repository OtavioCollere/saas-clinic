import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { AestheticHistory } from './aesthetic-history';
import type { HealthConditions } from './health-conditions';
import type { MedicalHistory } from './medical-history';
import type { PhysicalAssessment } from './physical-assessment';
export interface AnamnesisProps {
    patientId: UniqueEntityId;
    aestheticHistory: AestheticHistory;
    healthConditions: HealthConditions;
    medicalHistory: MedicalHistory;
    physicalAssessment: PhysicalAssessment;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Anamnesis extends Entity<AnamnesisProps> {
    static create(props: Optional<AnamnesisProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId): Anamnesis;
    get patientId(): UniqueEntityId;
    get aestheticHistory(): AestheticHistory;
    get healthConditions(): HealthConditions;
    get medicalHistory(): MedicalHistory;
    get physicalAssessment(): PhysicalAssessment;
    get createdAt(): Date;
    get updatedAt(): Date | undefined;
    set patientId(patientId: UniqueEntityId);
    set aestheticHistory(aestheticHistory: AestheticHistory);
    set healthConditions(healthConditions: HealthConditions);
    set medicalHistory(medicalHistory: MedicalHistory);
    set physicalAssessment(physicalAssessment: PhysicalAssessment);
    set updatedAt(updatedAt: Date);
}
