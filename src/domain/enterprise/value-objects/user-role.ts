export type UserRoleType = 'OWNER' | 'PROFESSIONAL' | 'PATIENT'; 

export class UserRole{
  constructor(
    private readonly value : UserRoleType
  ) {}

  static owner(){
    return new UserRole('OWNER')
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
}