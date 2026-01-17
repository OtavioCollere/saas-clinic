export type UserRoleType = 'ADMIN' | 'MEMBER';
export declare class UserRole {
    private readonly value;
    constructor(value: UserRoleType);
    static admin(): UserRole;
    static member(): UserRole;
    isAdmin(): boolean;
    isMember(): boolean;
    getValue(): UserRoleType;
}
