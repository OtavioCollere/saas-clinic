import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeRight } from "@/shared/either/either";
import type { Patient } from "@/domain/enterprise/entities/patient";
import { PatientRepository } from "../../repositories/patient-repository";

interface FetchPatientsByClinicIdUseCaseRequest {
  clinicId: string;
  page?: number;
  pageSize?: number;
  query?: string;
}

type FetchPatientsByClinicIdUseCaseResponse = Either<
  never,
  { patients: Patient[] }
>;

@Injectable()
export class FetchPatientsByClinicIdUseCase {
  constructor(
    @Inject(PatientRepository)
    private patientRepository: PatientRepository
  ) {}

  async execute({
    clinicId,
    page = 1,
    pageSize = 20,
    query,
  }: FetchPatientsByClinicIdUseCaseRequest): Promise<FetchPatientsByClinicIdUseCaseResponse> {
    const all = await this.patientRepository.findByClinicId(clinicId);

    const filtered = query
      ? all.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      : all;

    const start = (page - 1) * pageSize;
    const patients = filtered.slice(start, start + pageSize);

    return makeRight({ patients });
  }
}
