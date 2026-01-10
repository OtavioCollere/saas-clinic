export type UserRoleType = 'ADMIN' | 'OWNER' | 'PROFESSIONAL' | 'PATIENT'; 

export class UserRole{
  constructor(
    private readonly value : UserRoleType
  ) {}

  static admin(){
    return new UserRole('ADMIN')
  }

  static owner(){
    return new UserRole('OWNER')
  }

  static professional() {
    return new UserRole('PROFESSIONAL')
  }

  static patient() {
    return new UserRole('PATIENT')
  }

  isAdmin(){
    return this.value === 'ADMIN';
  }

  isOwner(){
    return this.value === 'OWNER';
  }

  isProfessional(){
    return this.value === 'PROFESSIONAL';
  }

  isPatient(){
    return this.value === 'PATIENT';
  }

  getValue(): UserRoleType {
    return this.value;
  }
}