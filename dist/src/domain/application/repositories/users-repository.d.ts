import { User } from "@/domain/enterprise/entities/user";
export declare abstract class UsersRepository {
    abstract create(user: User): Promise<User>;
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract update(user: User): Promise<User>;
    abstract delete(id: string): Promise<void>;
}
