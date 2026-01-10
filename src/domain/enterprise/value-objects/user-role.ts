export type UserRoleType = 'ADMIN' | 'OWNER' | 'PROFESSIONAL' | 'PATIENT' | 'STAFF'; 

export class UserRole{
  constructor(
    private readonly value : UserRoleType
  ) {}

  static owner(){
    return new UserRole('OWNER')
  }

  static staff(){
    return new UserRole('STAFF')
  }

  static professional() {
    return new UserRole('PROFESSIONAL')
  }

  static patient() {
    return new UserRole('PATIENT')
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

  isStaff(){
    return this.value === 'STAFF';
  }
}