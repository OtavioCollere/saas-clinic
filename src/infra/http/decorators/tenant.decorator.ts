import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

/**
 * Decorator to extract tenant (clinic slug) from request.
 * 
 * Supports two methods:
 * 1. Header: X-Tenant-ID
 * 2. Query Parameter: ?tenant=...
 * 
 * Usage:
 * ```ts
 * @Get()
 * async handle(@Tenant() tenant: string) {
 *   // tenant will be the clinic slug
 * }
 * ```
 * 
 * The tenant can be provided via:
 * - Header: `X-Tenant-ID: clinica-principal`
 * - Query: `?tenant=clinica-principal`
 */
export const Tenant = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    // Try header first (X-Tenant-ID) - Fastify normalizes headers to lowercase
    // But we check both lowercase and original case
    const headerTenant = 
      (request.headers['x-tenant-id'] as string) || 
      (request.headers['X-Tenant-ID'] as string) ||
      (request.headers['x-tenant-id'] as string | string[])?.[0];

    if (headerTenant) {
      return typeof headerTenant === 'string' ? headerTenant.trim() : undefined;
    }

    // Fallback to query parameter (?tenant=...)
    // Fastify query can be string, string[], or object
    const query = request.query as { tenant?: string | string[] } | undefined;
    const queryTenant = query?.tenant;

    if (queryTenant) {
      return typeof queryTenant === 'string' 
        ? queryTenant.trim() 
        : Array.isArray(queryTenant) 
          ? queryTenant[0]?.trim() 
          : undefined;
    }

    return undefined;
  },
);

