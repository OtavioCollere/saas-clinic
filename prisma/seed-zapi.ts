import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const clinic = await prisma.clinic.findFirst({
    where: { slug: 'bianca-collere' },
  })

  if (!clinic) {
    console.error('Clínica com slug "bianca-collere" não encontrada.')
    console.error('Verifique o slug correto com: SELECT slug FROM clinics;')
    process.exit(1)
  }

  await prisma.clinic.update({
    where: { id: clinic.id },
    data: {
      zapInstanceId: '3F256DF302529137041F26F49989160C',
      zapToken: 'C038222B22B818D902BCC772',
      zapClientToken: 'Fdcaa7e5468364e27bc1ba066d1861c66S',
    },
  })

  console.log(`✓ Credenciais Z-API configuradas para a clínica "${clinic.name}" (${clinic.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
