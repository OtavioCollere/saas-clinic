import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import { ClinicStatus } from '../value-objects/clinic-status';
import { Slug } from '../value-objects/slug';
export interface ClinicProps {
    ownerId: UniqueEntityId;
    name: string;
    slug: Slug;
    description?: string;
    avatarUrl?: string;
    status: ClinicStatus;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class Clinic extends Entity<ClinicProps> {
    static create(props: Optional<ClinicProps, 'createdAt' | 'updatedAt' | 'slug' | 'status'>, id?: UniqueEntityId): Clinic;
    get name(): string;
    get slug(): Slug;
    get description(): string | undefined;
    get avatarUrl(): string | undefined;
    get ownerId(): UniqueEntityId;
    get createdAt(): Date;
    get status(): ClinicStatus;
    get updatedAt(): Date | undefined;
    set name(name: string);
    set slug(slug: Slug);
    set description(description: string | undefined);
    set avatarUrl(avatarUrl: string | undefined);
    set ownerId(ownerId: UniqueEntityId);
    set status(status: ClinicStatus);
    set updatedAt(updatedAt: Date);
}
