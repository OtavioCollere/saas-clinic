import type { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis';
export declare abstract class AnamnesisRepository {
    abstract create(anamnesis: Anamnesis): Promise<Anamnesis>;
    abstract findById(id: string): Promise<Anamnesis | null>;
    abstract findByPatientId(patientId: string): Promise<Anamnesis | null>;
    abstract update(anamnesis: Anamnesis): Promise<Anamnesis>;
}
