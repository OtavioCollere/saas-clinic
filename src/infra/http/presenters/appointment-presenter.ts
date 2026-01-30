import type { Appointment } from "@/domain/enterprise/entities/appointment";

export class AppointmentPresenter {
	static toHTTP(appointment: Appointment) {
		return {
			id: appointment.id.toString(),
			professionalId: appointment.professionalId.toString(),
			franchiseId: appointment.franchiseId.toString(),
			patientId: appointment.patientId.toString(),
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
