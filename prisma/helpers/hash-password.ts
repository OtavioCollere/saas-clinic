import bcrypt from 'bcryptjs';

/**
 * Helper function to hash passwords for seed data
 * Uses the same salt rounds (8) as the application's BcryptHasher
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 8);
}




