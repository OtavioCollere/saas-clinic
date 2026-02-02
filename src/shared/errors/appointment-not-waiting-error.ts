export class AppointmentNotWaitingError extends Error {
	constructor() {
		super('Only waiting appointments can be confirmed or canceled');
	}
}
