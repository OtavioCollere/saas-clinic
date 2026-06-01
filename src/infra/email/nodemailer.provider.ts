import { Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

const logger = new Logger('NodemailerProvider')

export const createNodemailerTransporter = async () => {
  // Cria uma conta de teste do Ethereal Email dinamicamente
  // Isso garante que as credenciais sempre estejam válidas
  const testAccount = await nodemailer.createTestAccount()

  logger.log(
    `📧 Ethereal Email: Conta criada. Web: ${testAccount.web} | User: ${testAccount.user}`,
  )

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Verifica a conexão
  await transporter.verify()
  logger.log('✅ Nodemailer: Conexão SMTP verificada com sucesso')

  return transporter;
}

