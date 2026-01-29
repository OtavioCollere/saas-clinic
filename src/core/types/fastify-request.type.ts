import { FastifyRequest } from 'fastify';

/**
 * Extended Fastify request type for NestJS
 * Includes common properties used across the application
 */
export interface AppRequest extends FastifyRequest {
  ip: string;
  user?: {
    userId: string;
    sessionId: string;
  };
}
