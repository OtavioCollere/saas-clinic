import { isRight, unwrapEither } from "@/shared/either/either";
import { makePatient } from "tests/factories/makePatient";
import { InMemoryPatientRepository } from "tests/in-memory-repositories/in-memory-patient-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchPatientsByClinicIdUseCase } from "../fetch-patients-by-clinic-id";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

describe("FetchPatientsByClinicIdUseCase Unit Tests", () => {
  let sut: FetchPatientsByClinicIdUseCase;
  let inMemoryPatientRepository: InMemoryPatientRepository;

  beforeEach(() => {
    inMemoryPatientRepository = new InMemoryPatientRepository();
    sut = new FetchPatientsByClinicIdUseCase(inMemoryPatientRepository);
  });

  it("should be able to fetch patients by clinic id", async () => {
    const clinicId = new UniqueEntityId();
    const patient1 = makePatient({ clinicId, name: "Patient 1" });
    const patient2 = makePatient({ clinicId, name: "Patient 2" });
    const otherPatient = makePatient();

    inMemoryPatientRepository.items.push(patient1, patient2, otherPatient);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(2);
      expect(unwrapEither(result).patients[0].name).toEqual("Patient 1");
      expect(unwrapEither(result).patients[1].name).toEqual("Patient 2");
    }
  });

  it("should return empty array when clinic has no patients", async () => {
    const clinicId = new UniqueEntityId();

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(0);
    }
  });

  it("should paginate results", async () => {
    const clinicId = new UniqueEntityId();
    const patients = Array.from({ length: 5 }, (_, i) =>
      makePatient({ clinicId, name: `Patient ${i + 1}` })
    );
    inMemoryPatientRepository.items.push(...patients);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
      page: 1,
      pageSize: 2,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(2);
    }
  });

  it("should filter by query", async () => {
    const clinicId = new UniqueEntityId();
    const patient1 = makePatient({ clinicId, name: "João Silva" });
    const patient2 = makePatient({ clinicId, name: "Maria Santos" });
    const patient3 = makePatient({ clinicId, name: "João Pedro" });
    inMemoryPatientRepository.items.push(patient1, patient2, patient3);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
      query: "João",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).patients).toHaveLength(2);
    }
  });
});
