import { isRight, unwrapEither } from "@/core/either/either";
import { ClinicStatus } from "@/domain/enterprise/value-objects/clinic-status";
import { makeClinic } from "tests/factories/makeClinic";
import { makeUser } from "tests/factories/makeUser";
import { InMemoryClinicRepository } from "tests/in-memory-repositories/in-memory-clinic-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchClinicUseCase } from "../fetch-clinic";

describe("FetchClinicUseCase Unit Tests", () => {
	let sut: FetchClinicUseCase;
	let inMemoryClinicRepository: InMemoryClinicRepository;

	beforeEach(() => {
		inMemoryClinicRepository = new InMemoryClinicRepository();
		sut = new FetchClinicUseCase(inMemoryClinicRepository);
	});

	it("should be able to fetch clinics with pagination", async () => {
		const owner = makeUser();

		for (let i = 0; i < 22; i++) {
			const clinic = makeClinic({
				ownerId: owner.id,
				name: `Clinic ${i + 1}`,
				status: ClinicStatus.active(),
			});
			inMemoryClinicRepository.items.push(clinic);
		}

		const result = await sut.execute({
			page: 1,
			pageSize: 20,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinics).toHaveLength(20);
		}
	});

	it("should be able to fetch clinics with pagination on second page", async () => {
		const owner = makeUser();

		for (let i = 0; i < 22; i++) {
			const clinic = makeClinic({
				ownerId: owner.id,
				name: `Clinic ${i + 1}`,
				status: ClinicStatus.active(),
			});
			inMemoryClinicRepository.items.push(clinic);
		}

		const result = await sut.execute({
			page: 2,
			pageSize: 20,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinics).toHaveLength(2);
		}
	});

	it("should be able to fetch clinics with query filter", async () => {
		const owner = makeUser();

		const clinic1 = makeClinic({
			ownerId: owner.id,
			name: "Clinic A",
			status: ClinicStatus.active(),
		});
		const clinic2 = makeClinic({
			ownerId: owner.id,
			name: "Clinic B",
			status: ClinicStatus.active(),
		});
		const clinic3 = makeClinic({
			ownerId: owner.id,
			name: "Another Place",
			status: ClinicStatus.active(),
		});

		inMemoryClinicRepository.items.push(clinic1, clinic2, clinic3);

		const result = await sut.execute({
			page: 1,
			pageSize: 20,
			query: "Clinic",
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinics).toHaveLength(2);
			expect(unwrapEither(result).clinics[0].name).toEqual("Clinic A");
			expect(unwrapEither(result).clinics[1].name).toEqual("Clinic B");
		}
	});

	it("should be able to fetch clinics with default page size", async () => {
		const owner = makeUser();

		for (let i = 0; i < 25; i++) {
			const clinic = makeClinic({
				ownerId: owner.id,
				name: `Clinic ${i + 1}`,
				status: ClinicStatus.active(),
			});
			inMemoryClinicRepository.items.push(clinic);
		}

		const result = await sut.execute({
			page: 1,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinics).toHaveLength(20);
		}
	});

	it("should return empty array when no clinics match", async () => {
		const result = await sut.execute({
			page: 1,
			pageSize: 20,
		});

		expect(isRight(result)).toBeTruthy();
		if (isRight(result)) {
			expect(unwrapEither(result).clinics).toHaveLength(0);
		}
	});
});
