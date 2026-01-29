import { SessionsRepository } from '../../src/domain/application/repositories/sessions-repository';
import { Session } from '../../src/domain/enterprise/entities/session';
import { SessionStatus } from '../../src/domain/enterprise/value-objects/session-status';

export class InMemorySessionsRepository extends SessionsRepository {
    public items: Session[] = [];

    async create(session: Session): Promise<Session> {
        this.items.push(session);
        return session;
    }

    async findById(id: string): Promise<Session | null> {
        const session = this.items.find((item) => item.id.toString() === id);
        
        if (!session) return null;

        return session;
    }

    async findActiveByUserId(userId: string): Promise<Session[]> {
        return this.items.filter(
            (item) => item.userId.toString() === userId && item.status === SessionStatus.ACTIVE
        );
    }

    async findByUserId(userId: string): Promise<Session[]> {
        return this.items.filter((item) => item.userId.toString() === userId);
    }

    async update(session: Session): Promise<Session> {
        const index = this.items.findIndex((item) => item.id.toString() === session.id.toString());
        
        if (index === -1) {
            throw new Error('Session not found');
        }
        
        this.items[index] = session;
        return session;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id.toString() === id);
        
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}

