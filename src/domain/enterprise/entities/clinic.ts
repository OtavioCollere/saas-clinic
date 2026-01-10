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

export class Clinic extends Entity<ClinicProps> {
  static create(
    props: Optional<ClinicProps, 'createdAt' | 'updatedAt' | 'slug' | 'status'>,
    id?: UniqueEntityId
  ) {
    const slug = props.slug ?? Slug.create(props.name);

    const clinic = new Clinic(
      {
        ...props,
        slug,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? ClinicStatus.active(),
      },
      id
    );
    return clinic;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get status() {
    return this.props.status;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set slug(slug: Slug) {
    this.props.slug = slug;
  }

  set description(description: string | undefined) {
    this.props.description = description;
  }

  set avatarUrl(avatarUrl: string | undefined) {
    this.props.avatarUrl = avatarUrl;
  }

  set ownerId(ownerId: UniqueEntityId) {
    this.props.ownerId = ownerId;
  }

  set status(status: ClinicStatus) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
