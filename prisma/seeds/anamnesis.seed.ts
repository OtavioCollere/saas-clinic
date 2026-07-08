import { PrismaClient } from '@prisma/client';

type Diabetes = 'controlled' | 'yes' | 'no';

interface AnamnesisTemplate {
  aestheticHistory: object;
  healthConditions: object;
  medicalHistory: object;
  physicalAssessment: object;
}

const TEMPLATES: AnamnesisTemplate[] = [
  // Paciente jovem saudável, primeira vez em clínica estética
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: { bloodPressure: '110/70', height: 1.65, initialWeight: 58 },
  },

  // Paciente com histórico de botox e preenchimento
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: true,
      botulinumToxin: true,
      botulinumRegion: 'Testa',
      filler: true,
      fillerRegion: 'Lábios',
      fillerProduct: 'Juvederm Ultra',
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: true,
      chemicalPeelingRegion: 'Nariz',
      chemicalPeelingProduct: 'TCA 30%',
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: true,
      allergyDetails: 'Dipirona',
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: true,
      acidsDetails: 'Ácido glicólico 5% em casa',
    },
    physicalAssessment: { bloodPressure: '120/80', height: 1.68, initialWeight: 63 },
  },

  // Paciente com hipertensão controlada e medicação
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: true,
      botulinumToxin: true,
      botulinumRegion: 'Glabela',
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: false,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: true,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: true,
      medicalTreatmentDetails: 'Cardiologista — hipertensão',
    },
    medicalHistory: {
      usesMedication: true,
      medicationDetails: 'Losartana 50mg 1x/dia',
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: { bloodPressure: '140/90', height: 1.72, initialWeight: 78 },
  },

  // Paciente com diabetes controlada
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: true,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: true,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: true,
      medicalTreatmentDetails: 'Endocrinologista — diabetes tipo 2',
    },
    medicalHistory: {
      usesMedication: true,
      medicationDetails: 'Metformina 850mg 2x/dia',
      allergy: false,
      lactoseIntolerance: true,
      diabetes: 'controlled' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: { bloodPressure: '125/82', height: 1.60, initialWeight: 72 },
  },

  // Paciente com histórico estético extenso
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: true,
      botulinumToxin: true,
      botulinumRegion: 'Olhos / Pés de galinha',
      filler: true,
      fillerRegion: 'Bochecha / Malar',
      fillerProduct: 'Restylane Lyft',
      suspensionThreads: true,
      suspensionThreadsRegion: 'Pescoço / Platisma',
      suspensionThreadsProduct: 'Fio de PDO liso',
      surgicalLift: false,
      chemicalPeeling: true,
      chemicalPeelingRegion: 'Nariz',
      chemicalPeelingProduct: 'Peeling de Jessner',
      laser: true,
      laserRegion: 'Testa',
      laserProduct: 'Fracionado CO2',
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: true,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: true,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: true,
      medicalTreatmentDetails: 'Ginecologista — reposição hormonal',
    },
    medicalHistory: {
      usesMedication: true,
      medicationDetails: 'Estradiol 2mg + Progesterona 100mg',
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: true,
      skinProblemsDetails: 'Rosácea grau I',
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: true,
      prosthesisDetails: 'Implante de silicone mamário (2018)',
      usingAcids: true,
      acidsDetails: 'Vitamina C 10% e retinol 0,3% à noite',
    },
    physicalAssessment: { bloodPressure: '118/76', height: 1.70, initialWeight: 67 },
  },

  // Paciente masculino sem histórico
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: true,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: false,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: true,
      orthopedicProblemsDetails: 'Hérnia de disco L4-L5',
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: { bloodPressure: '130/85', height: 1.80, initialWeight: 88 },
  },

  // Paciente com alergia e skin problems
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: true,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: true,
      chemicalPeelingRegion: 'Nariz',
      chemicalPeelingProduct: 'Salicílico 20%',
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: false,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: true,
      allergyDetails: 'Látex e sulfato de níquel',
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: true,
      skinProblemsDetails: 'Dermatite atópica leve',
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: { bloodPressure: '108/68', height: 1.62, initialWeight: 54 },
  },

  // Paciente pós-cirurgia recente
  {
    aestheticHistory: {
      hadPreviousAestheticTreatment: true,
      botulinumToxin: true,
      botulinumRegion: 'Testa',
      filler: true,
      fillerRegion: 'Sulco nasolabial',
      fillerProduct: 'Sculptra',
      suspensionThreads: false,
      surgicalLift: true,
      surgicalLiftRegion: 'Bochecha / Malar',
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no' as Diabetes,
      roacutan: false,
      recentSurgery: true,
      recentSurgeryDetails: 'Rinoplastia — outubro de 2024',
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: true,
      acidsDetails: 'Tretinoína 0,025% — uso noturno',
    },
    physicalAssessment: { bloodPressure: '115/75', height: 1.67, initialWeight: 60 },
  },
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// Gera variações do template para simular histórico de evolução
function evolve(base: AnamnesisTemplate, step: number): AnamnesisTemplate {
  const weightDelta = [-3, -1.5, -0.5][step] ?? 0;
  const physicalAssessment = {
    ...(base.physicalAssessment as Record<string, unknown>),
    initialWeight:
      ((base.physicalAssessment as Record<string, unknown>).initialWeight as number) + weightDelta,
  };

  // step 0 (mais antigo): sem medicação, step 1: adiciona, step 2 (atual): mantém
  const medicalHistory = step === 0
    ? { ...(base.medicalHistory as Record<string, unknown>), usesMedication: false, medicationDetails: undefined }
    : base.medicalHistory;

  return { ...base, physicalAssessment, medicalHistory };
}

export async function seedAnamnesis(
  prisma: PrismaClient,
  patients: Array<{ id: string }>
) {
  console.log('📋 Criando anamneses e histórico...');

  // 30 pacientes com anamnese; 20 ficam sem (para testar estado vazio)
  const toSeed = patients.slice(0, 30);
  let created = 0;
  let historyCount = 0;

  for (let i = 0; i < toSeed.length; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];

    const anamnesis = await prisma.anamnesis.create({
      data: {
        patientId: toSeed[i].id,
        aestheticHistory: template.aestheticHistory,
        healthConditions: template.healthConditions,
        medicalHistory: template.medicalHistory,
        physicalAssessment: template.physicalAssessment,
        patientSignature: i < 20 ? `data:image/png;base64,paciente${i + 1}` : null,
        signedAt: i < 20 ? daysAgo(30 + i * 2) : null,
      },
    });
    created++;

    // Pacientes 0-9: 3 versões de histórico (pacientes antigos, vieram 3 vezes)
    // Pacientes 10-19: 2 versões
    // Pacientes 20-29: 1 versão (cadastro recente, só atualizaram 1x)
    const historySteps = i < 10 ? 3 : i < 20 ? 2 : 1;

    // Snapshots mais antigos primeiro
    const baseOffsets = [180, 90, 45]; // dias atrás para cada versão
    for (let step = 0; step < historySteps; step++) {
      const snapshot = evolve(template, step);
      const savedAt = daysAgo(baseOffsets[step] ?? 20);
      await prisma.anamnesisHistory.create({
        data: {
          anamnesisId: anamnesis.id,
          patientId: toSeed[i].id,
          aestheticHistory: snapshot.aestheticHistory,
          healthConditions: snapshot.healthConditions,
          medicalHistory: snapshot.medicalHistory,
          physicalAssessment: snapshot.physicalAssessment,
          patientSignature: step === historySteps - 1 && i < 20
            ? `data:image/png;base64,paciente${i + 1}`
            : null,
          signedAt: step === historySteps - 1 && i < 20 ? savedAt : null,
          savedAt,
        },
      });
      historyCount++;
    }
  }

  console.log(`✅ ${created} anamneses criadas, ${historyCount} entradas de histórico`);
  console.log(`   (${patients.length - created} pacientes sem anamnese — para testar estado vazio)`);
}
