import { isLeft, isRight, unwrapEither } from "@/shared/either/either";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { FranchiseStatus } from "@/domain/enterprise/value-objects/franchise-status";
import { makeClinic } from "tests/factories/makeClinic";
import { makeFranchise } from "tests/factories/makeFranchise";
import { makeUser } from "tests/factories/makeUser";
import { InMemoryClinicRepository } from "tests/in-memory-repositories/in-memory-clinic-repository";
import { InMemoryFranchiseRepository } from "tests/in-memory-repositories/in-memory-franchise-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchFranchisesByClinicIdUseCase } from "../fetch-franchises-by-clinic-id";

describe("FetchFranchisesByClinicIdUseCase Unit Tests", () => {
	let sut: FetchFranchisesByClinicIdUseCase;
	let inMemoryFranchiseRepository: InMemoryFranchiseRepository;
	let inMemoryClinicRepository: InMemoryClinicRepository;

	beforeEach(() => {
		inMemoryFranchiseRepository = new InMemoryFranchiseRepository();
		inMemoryClinicRepository = new InMemoryClinicRepository();
		sut = new FetchFranchisesByClinicIdUseCase(
			inMemoryFranchiseRepository,
			inMemoryClinicRepository,
		);
	});

	it("should be able to fetch franchises by clinic id", async () => {
		const owner = makeUser();
		const clinic = makeClinic({
			ownerId: owner.id,
		});
		const franchise1 = makeFranchise({
			clinicId: clinic.id,
			name: "Franchise 1",
			status: FranchiseStatus.active(),
		});
		const franchise2 = makeFranchise({
			clinicId: clinic.id,
			name: "Franchise 2",
			status: FranchiseStatus.active(),
		});
		inMemoryClinicRepository.items.push(clinic);
		inMemoryFranchiseRepository.items.push(franchise1, franchise2);

		const result = await sut.execute({
			clinicId: clinic.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).franchises).toHaveLength(2);
			expect(unwrapEither(result).franchises[0].name).toEqual("Franchise 1");
			expect(unwrapEither(result).franchises[1].name).toEqual("Franchise 2");
		}
	});

	it("should not be able to fetch franchises with non existent clinic", async () => {
		const result = await sut.execute({
			clinicId: "non-existent-clinic-id",
		});

		expect(isLeft(result)).toBeTruthy();
		expect(unwrapEither(result)).toBeInstanceOf(ClinicNotFoundError);
	});

	it("should return empty array when clinic has no franchises", async () => {
		const owner = makeUser();
		const clinic = makeClinic({
			ownerId: owner.id,
		});
		inMemoryClinicRepository.items.push(clinic);

		const result = await sut.execute({
			clinicId: clinic.id.toString(),
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).franchises).toHaveLength(0);
		}
	});
});
