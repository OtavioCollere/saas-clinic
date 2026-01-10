import { UsersRepository } from '../../src/domain/application/repositories/users-repository';
import { User } from '../../src/domain/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = [];

    async create(user: User): Promise<User> {
        this.items.push(user);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.items.find((item) => item.id.toString() === id);
        
        if (!user) return null;

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const normalizedEmail = email.trim().toLowerCase();
        const user = this.items.find((item) => item.email.getValue() === normalizedEmail);
        
        if (!user) return null;

        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.items.findIndex((item) => item.id.toString() === user.id.toString());
        
        if (index === -1) {
            throw new Error('User not found');
        }
        
        this.items[index] = user;
        return user;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id.toString() === id);
        
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}