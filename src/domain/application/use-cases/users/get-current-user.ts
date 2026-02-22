import { Injectable, Inject } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "@/shared/either/either";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import type { User } from "@/domain/enterprise/entities/user";
import { ClinicRepository } from "../../repositories/clinic-repository";
import { ClinicNotFoundError } from "@/shared/errors/clinic-not-found-error";
import { ClinicMembershipRepository } from "../../repositories/clinic-membership-repository";
import { ClinicMembershipNotFoundError } from "@/shared/errors/clinic-membership-not-found-error";
import { CLINIC_ROLE_PERMISSIONS } from "../../authorization/security/access-control/role-permissions-map";
import type { ClinicRole } from "@/domain/enterprise/value-objects/clinic-role";
import type { ClinicPermissions } from "../../authorization/security/access-control/permission";

interface GetCurrentUserUseCaseRequest {
	userId: string;
	clinicSlug: string;
}

type GetCurrentUserUseCaseResponse = Either<UserNotFoundError, { 
	user: User;
	clinicMembershipId: string;
	clinicId: string;
	clinicRole: ClinicRole;
	permissions: ClinicPermissions[];
 }>;

@Injectable()
export class GetCurrentUserUseCase {
	constructor(
		@Inject(UsersRepository)
		private readonly usersRepository: UsersRepository,
		@Inject(ClinicRepository)
		private readonly clinicRepository: ClinicRepository,
		@Inject(ClinicMembershipRepository)
		private readonly clinicMembershipRepository: ClinicMembershipRepository,
	) {}

	async execute({ userId, clinicSlug }: GetCurrentUserUseCaseRequest): Promise<GetCurrentUserUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return makeLeft(new UserNotFoundError());
		}

		const clinic = await this.clinicRepository.findBySlug(clinicSlug);

		if (!clinic) {
			return makeLeft(new ClinicNotFoundError());
		}

		const clinicMembership = await this.clinicMembershipRepository.findByUserAndClinic(userId, clinic.id.toString());

		if (!clinicMembership) {
			return makeLeft(new ClinicMembershipNotFoundError());
		}

		const base = {
			user,
			clinicMembershipId: clinicMembership.id.toString(),
			clinicId: clinic.id.toString(),
			clinicRole: clinicMembership.role,
			permissions: CLINIC_ROLE_PERMISSIONS[clinicMembership.role.getValue()] as ClinicPermissions[],
		};

		// Só para PATIENT: verifica anamnese e expõe patientId
		if (clinicMembership.role.isPatient()) {
			const patient = await this.patientRepository.findByUserId(userId);
			const isAnamneseDone = patient
				? !!(await this.anamnesisRepository.findByPatientId(patient.id.toString()))
				: false;
			const patientId = patient?.id.toString();
			return makeRight({ ...base, isAnamneseDone, patientId });
		}

		// Só para PROFESSIONAL: expõe professionalId (primeiro da clínica com esse userId)
		if (clinicMembership.role.isProfessional()) {
			const professionals = await this.professionalRepository.findByClinicId(clinic.id.toString());
			const professional = professionals.find((p) => p.userId.toString() === userId);
			const professionalId = professional?.id.toString();
			return makeRight({ ...base, professionalId });
		}

		return makeRight(base);
	}
}




