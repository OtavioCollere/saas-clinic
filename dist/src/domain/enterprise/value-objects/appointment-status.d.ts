export type AppointmentStatusType = 'WAITING' | 'CONFIRMED' | 'DONE' | 'CANCELED';
export declare class AppointmentStatus {
    private readonly value;
    private constructor();
    static waiting(): AppointmentStatus;
    static confirmed(): AppointmentStatus;
    static done(): AppointmentStatus;
    static canceled(): AppointmentStatus;
    isWaiting(): boolean;
    isConfirmed(): boolean;
    isDone(): boolean;
    isCanceled(): boolean;
    getValue(): AppointmentStatusType;
    confirm(): AppointmentStatus;
    cancel(): AppointmentStatus;
    finish(): AppointmentStatus;
}
