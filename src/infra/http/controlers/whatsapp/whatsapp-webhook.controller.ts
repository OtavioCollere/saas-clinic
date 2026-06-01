import { Body, Controller, Inject, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { HandleWhatsAppMessageUseCase } from '@/domain/application/use-cases/whatsapp/handle-whatsapp-message'
import { Public } from '@/infra/auth/public'

const webhookBodySchema = z.object({
  phone: z.string(),
  fromMe: z.boolean(),
  text: z.object({ message: z.string() }).optional(),
})

type WebhookBodySchema = z.infer<typeof webhookBodySchema>

const webhookBodyValidationPipe = new ZodValidationPipe(webhookBodySchema)

@ApiTags('Webhooks')
@Controller('/webhooks/whatsapp')
export class WhatsappWebhookController {
  constructor(
    @Inject(HandleWhatsAppMessageUseCase)
    private readonly handleWhatsAppMessageUseCase: HandleWhatsAppMessageUseCase,
  ) {}

  @Post(':franchiseId')
  @Public()
  async handle(
    @Param('franchiseId') franchiseId: string,
    @Body(webhookBodyValidationPipe) body: WebhookBodySchema,
  ) {
    if (body.fromMe || !body.text?.message) return

    await this.handleWhatsAppMessageUseCase.execute({
      franchiseId,
      fromPhone: body.phone.replace('@c.us', ''),
      message: body.text.message,
    })
  }
}
