export type ConversationStepType =
  | 'AWAITING_CPF'
  | 'AWAITING_PROFESSIONAL'
  | 'AWAITING_DATE'
  | 'AWAITING_TIME'
  | 'AWAITING_CONFIRMATION'

export class ConversationStep {
  private constructor(private readonly value: ConversationStepType) {}

  static awaitingCpf() { return new ConversationStep('AWAITING_CPF') }
  static awaitingProfessional() { return new ConversationStep('AWAITING_PROFESSIONAL') }
  static awaitingDate() { return new ConversationStep('AWAITING_DATE') }
  static awaitingTime() { return new ConversationStep('AWAITING_TIME') }
  static awaitingConfirmation() { return new ConversationStep('AWAITING_CONFIRMATION') }

  static fromValue(value: string): ConversationStep {
    return new ConversationStep(value as ConversationStepType)
  }

  isAwaitingCpf() { return this.value === 'AWAITING_CPF' }
  isAwaitingProfessional() { return this.value === 'AWAITING_PROFESSIONAL' }
  isAwaitingDate() { return this.value === 'AWAITING_DATE' }
  isAwaitingTime() { return this.value === 'AWAITING_TIME' }
  isAwaitingConfirmation() { return this.value === 'AWAITING_CONFIRMATION' }

  getValue(): ConversationStepType { return this.value }
}
