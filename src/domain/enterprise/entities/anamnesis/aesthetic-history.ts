import { type AestheticRegionType } from '../../value-objects/aesthetic-region';

export interface AestheticHistory {
  hadPreviousAestheticTreatment: boolean;
  botulinumToxin: boolean;
  botulinumRegion?: AestheticRegionType;
  filler: boolean;
  fillerRegion?: AestheticRegionType;
  fillerProduct?: string;
  suspensionThreads: boolean;
  suspensionThreadsRegion?: AestheticRegionType;
  suspensionThreadsProduct?: string;
  surgicalLift: boolean;
  surgicalLiftRegion?: AestheticRegionType;
  surgicalLiftProduct?: string;
  chemicalPeeling: boolean;
  chemicalPeelingRegion?: AestheticRegionType;
  chemicalPeelingProduct?: string;
  laser: boolean;
  laserRegion?: AestheticRegionType;
  laserProduct?: string;
  exposedToHeatOrColdWork: boolean;
}
