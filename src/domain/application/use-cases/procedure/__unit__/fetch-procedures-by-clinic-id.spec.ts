import { isRight, unwrapEither } from "@/shared/either/either";
import { makeProcedure } from "tests/factories/makeProcedure";
import { InMemoryProcedureRepository } from "tests/in-memory-repositories/in-memory-procedure-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchProceduresByClinicIdUseCase } from "../fetch-procedures-by-clinic-id";
import { makeFranchise } from "tests/factories/makeFranchise";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

describe("FetchProceduresByClinicIdUseCase Unit Tests", () => {
  let sut: FetchProceduresByClinicIdUseCase;
  let inMemoryProcedureRepository: InMemoryProcedureRepository;

  beforeEach(() => {
    inMemoryProcedureRepository = new InMemoryProcedureRepository();
    sut = new FetchProceduresByClinicIdUseCase(inMemoryProcedureRepository);
  });

  it("should be able to fetch procedures by clinic id", async () => {
    const clinicId = new UniqueEntityId();
    const franchise = makeFranchise({ clinicId });
    const procedure1 = makeProcedure({ franchiseId: franchise.id });
    const procedure2 = makeProcedure({ franchiseId: franchise.id });
    const otherProcedure = makeProcedure();

    inMemoryProcedureRepository.items.push(procedure1, procedure2, otherProcedure);
    inMemoryProcedureRepository.clinicFranchisesMap.set(clinicId.toString(), [franchise.id.toString()]);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedures).toHaveLength(2);
    }
  });

  it("should return empty array when clinic has no procedures", async () => {
    const clinicId = new UniqueEntityId();
    const franchise = makeFranchise({ clinicId });
    inMemoryProcedureRepository.clinicFranchisesMap.set(clinicId.toString(), [franchise.id.toString()]);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).procedures).toHaveLength(0);
    }
  });
});
