import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Email } from "../value-objects/email";
import { Entity } from "@/core/entities/entity";
import type { Optional } from "@/core/types/optional";

// regras de negocio
// o token dura 60 minutos
// o token deve ser gerado aleatoriamente
// o token deve ser enviado para o email do usuario
// o usuario deve clicar no link para verificar o email
// o usuario deve ser redirecionado para a pagina de verificacao de email
// o usuario deve ser redirecionado para a pagina de login

export interface EmailVerificationProps {
    userId: UniqueEntityId;
    email: Email;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
    verifiedAt? : Date
}

export class EmailVerification extends Entity<EmailVerificationProps> {
    static create(
        props: Optional<EmailVerificationProps, 'createdAt' | 'verifiedAt'>,
        id?: UniqueEntityId
      ) {
        const emailVerification = new EmailVerification(
          {
            ...props,
            createdAt: props.createdAt ?? new Date(),
            verifiedAt: props.verifiedAt ?? undefined
          },
          id
        );
        return emailVerification;
      }

    get userId() {
        return this.props.userId;
    }

    get email() {
        return this.props.email;
    }
    
    get token() {
        return this.props.token;
    }

    get verifiedAt(): Date | null {
        return this.props.verifiedAt ?? null;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }
    
    get createdAt() {
        return this.props.createdAt;
    }

    set verifiedAt(verifiedAt: Date) {
        this.props.verifiedAt = verifiedAt;
    }

    verifyEmail() {
        this.props.verifiedAt = new Date();
    }
}