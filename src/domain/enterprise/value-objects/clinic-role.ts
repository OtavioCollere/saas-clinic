export type ClinicRoleType = 'ADMIN' | 'OWNER' | 'PROFESSIONAL' | 'PATIENT' | 'COLLABORATOR';

export class ClinicRole{
  constructor(
    private readonly value : ClinicRoleType
  ) {}

  static owner(){
    return new ClinicRole('OWNER')
  }

  static admin(){
    return new ClinicRole('ADMIN')
  }

  static professional() {
    return new ClinicRole('PROFESSIONAL')
  }

  static patient() {
    return new ClinicRole('PATIENT')
  }

  static collaborator() {
    return new ClinicRole('COLLABORATOR')
  }

  isOwner(){
    return this.value === 'OWNER';
  }

  isAdmin(){
    return this.value === 'ADMIN';
  }

  isProfessional(){
    return this.value === 'PROFESSIONAL';
  }

  isPatient(){
    return this.value === 'PATIENT';
  }

  isCollaborator(){
    return this.value === 'COLLABORATOR';
  }

  getValue(): ClinicRoleType {
    return this.value;
  }
}
