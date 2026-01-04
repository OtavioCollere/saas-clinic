
import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'

import z from 'zod';
import type { User } from './models/user';
import { permissions } from './permissions';
import { userSubject, type UserSubject } from './subjects/user';
import { projectSubject, type ProjectSubject } from './subjects/project';
import { organizationSubject } from './subjects/organizations';
import { inviteSubject } from './subjects/invite';
import { billingSubject } from './subjects/billing';

const appAbilitySchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([
    z.literal('manage'),
    z.literal('all')
  ])
])

type AppAbilities = z.infer<typeof appAbilitySchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user : User) {
  const builder = new AbilityBuilder(createAppAbility)

  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}