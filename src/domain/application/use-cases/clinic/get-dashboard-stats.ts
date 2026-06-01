import { Inject, Injectable } from '@nestjs/common';
import { type Either, makeLeft, makeRight } from '@/shared/either/either';
import { ClinicNotFoundError } from '@/shared/errors/clinic-not-found-error';
import { ClinicRepository } from '../../repositories/clinic-repository';
import { AppointmentsRepository } from '../../repositories/appointments-repository';
import { PatientRepository } from '../../repositories/patient-repository';
import { ProfessionalRepository } from '../../repositories/professional-repository';

interface GetDashboardStatsUseCaseRequest {
  clinicId: string;
}

export interface DashboardStats {
  appointmentsToday: number;
  appointmentsTodayChange: number | null;
  totalPatients: number;
  totalPatientsChange: number | null;
  monthlyRevenue: number;
  monthlyRevenueChange: number | null;
  activeProfessionals: number;
}

type GetDashboardStatsUseCaseResponse = Either<ClinicNotFoundError, DashboardStats>;

function percentageChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(ClinicRepository)
    private clinicRepository: ClinicRepository,
    @Inject(AppointmentsRepository)
    private appointmentsRepository: AppointmentsRepository,
    @Inject(PatientRepository)
    private patientRepository: PatientRepository,
    @Inject(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
  ) {}

  async execute({ clinicId }: GetDashboardStatsUseCaseRequest): Promise<GetDashboardStatsUseCaseResponse> {
    const clinic = await this.clinicRepository.findById(clinicId);
    if (!clinic) {
      return makeLeft(new ClinicNotFoundError());
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfLastWeekDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const startOfLastWeekDayNext = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      appointmentsToday,
      appointmentsLastWeekDay,
      totalPatients,
      totalPatientsLastMonth,
      monthlyRevenue,
      lastMonthRevenue,
      activeProfessionals,
    ] = await Promise.all([
      this.appointmentsRepository.countByClinicIdAndDateRange(clinicId, startOfToday, startOfTomorrow),
      this.appointmentsRepository.countByClinicIdAndDateRange(clinicId, startOfLastWeekDay, startOfLastWeekDayNext),
      this.patientRepository.countByClinicId(clinicId),
      this.patientRepository.countByClinicIdCreatedBefore(clinicId, startOfThisMonth),
      this.appointmentsRepository.sumItemsPriceByClinicIdAndDateRange(clinicId, startOfThisMonth, startOfTomorrow),
      this.appointmentsRepository.sumItemsPriceByClinicIdAndDateRange(clinicId, startOfLastMonth, startOfThisMonth),
      this.professionalRepository.countByClinicId(clinicId),
    ]);

    return makeRight({
      appointmentsToday,
      appointmentsTodayChange: percentageChange(appointmentsToday, appointmentsLastWeekDay),
      totalPatients,
      totalPatientsChange: percentageChange(totalPatients, totalPatientsLastMonth),
      monthlyRevenue,
      monthlyRevenueChange: percentageChange(monthlyRevenue, lastMonthRevenue),
      activeProfessionals,
    });
  }
}
