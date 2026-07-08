import type { Appointment } from "@/domain/enterprise/entities/appointment";
import type { Patient } from "@/domain/enterprise/entities/patient";
import type { User } from "@/domain/enterprise/entities/user";

export class AppointmentPresenter {
	static toHTTP(appointment: Appointment, patient?: Patient, professionalUser?: User) {
		return {
			id: appointment.id.toString(),
			professionalId: appointment.professionalId.toString(),
			franchiseId: appointment.franchiseId.toString(),
			patientId: appointment.patientId.toString(),
			patientName: patient?.name,
			professionalName: professionalUser?.name,
			name: appointment.name,
			durationInMinutes: appointment.durationInMinutes,
			appointmentItems: appointment.appointmentItems.map((item) => ({
				id: item.id.toString(),
				procedureId: item.procedureId.toString(),
				price: item.price,
				notes: item.notes,
			})),
			startAt: appointment.startAt.toISOString(),
			endAt: appointment.endAt.toISOString(),
			status: appointment.status.getValue(),
			createdAt: appointment.createdAt.toISOString(),
			updatedAt: appointment.updatedAt?.toISOString(),
		};
	}
}
