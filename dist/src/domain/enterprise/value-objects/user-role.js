"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
class UserRole {
    constructor(value) {
        this.value = value;
    }
    static admin() {
        return new UserRole('ADMIN');
    }
    static member() {
        return new UserRole('MEMBER');
    }
    isAdmin() {
        return this.value === 'ADMIN';
    }
    isMember() {
        return this.value === 'MEMBER';
    }
    getValue() {
        return this.value;
    }
}
exports.UserRole = UserRole;
//# sourceMappingURL=user-role.js.map