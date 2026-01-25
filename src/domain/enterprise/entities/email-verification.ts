import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Email } from "../value-objects/email";
import { Entity } from "@/core/entities/entity";

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
    createdAt: Date;
    verifiedAt : Date
}

export class EmailVerification extends Entity<EmailVerificationProps> {
    static create(props: EmailVerificationProps, id?: UniqueEntityId) {
        const emailVerification = new EmailVerification(props, id);
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

    get expiresAt() {
        return this.props.expiresAt;
    }

    get createdAt() {
        return this.props.createdAt;
    }
}