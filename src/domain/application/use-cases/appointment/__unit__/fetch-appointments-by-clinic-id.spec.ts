import { isRight, unwrapEither } from "@/shared/either/either";
import { makeAppointment } from "tests/factories/makeAppointment";
import { makePatient } from "tests/factories/makePatient";
import { makeProfessional } from "tests/factories/makeProfessional";
import { InMemoryAppointmentsRepository } from "tests/in-memory-repositories/in-memory-appointments-repository";
import { InMemoryPatientRepository } from "tests/in-memory-repositories/in-memory-patient-repository";
import { InMemoryProfessionalRepository } from "tests/in-memory-repositories/in-memory-professional-repository";
import { InMemoryUsersRepository } from "tests/in-memory-repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchAppointmentsByClinicIdUseCase } from "../fetch-appointments-by-clinic-id";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { makeFranchise } from "tests/factories/makeFranchise";
import { makeClinic } from "tests/factories/makeClinic";
import { makeUser } from "tests/factories/makeUser";

describe("FetchAppointmentsByClinicIdUseCase Unit Tests", () => {
  let sut: FetchAppointmentsByClinicIdUseCase;
  let appointmentsRepository: InMemoryAppointmentsRepository;
  let patientRepository: InMemoryPatientRepository;
  let professionalRepository: InMemoryProfessionalRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository();
    patientRepository = new InMemoryPatientRepository();
    professionalRepository = new InMemoryProfessionalRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new FetchAppointmentsByClinicIdUseCase(
      appointmentsRepository,
      patientRepository,
      professionalRepository,
      usersRepository
    );
  });

  it("should be able to fetch appointments by clinic id", async () => {
    const clinicId = new UniqueEntityId();
    const franchise = makeFranchise({ clinicId });
    const user = makeUser();
    const professional = makeProfessional({ franchiseId: franchise.id, userId: user.id });
    const patient = makePatient({ clinicId });
    const appointment = makeAppointment({
      franchiseId: franchise.id,
      professionalId: professional.id,
      patientId: patient.id,
    });

    appointmentsRepository.clinicFranchisesMap.set(clinicId.toString(), [franchise.id.toString()]);
    appointmentsRepository.items.push(appointment);
    patientRepository.items.push(patient);
    professionalRepository.items.push(professional);
    usersRepository.items.push(user);

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments).toHaveLength(1);
      expect(unwrapEither(result).appointments[0].id.toString()).toEqual(appointment.id.toString());
    }
  });

  it("should return empty array when clinic has no appointments", async () => {
    const clinicId = new UniqueEntityId();

    const result = await sut.execute({
      clinicId: clinicId.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments).toHaveLength(0);
    }
  });
});
