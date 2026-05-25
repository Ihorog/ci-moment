import { z } from 'zod';

/**
 * Allowed context values. Must match the canonical engine CONTEXT_IDS.
 */
export const contextSchema = z.enum(['career', 'love', 'timing'] as const, {
  error: () => 'context must be one of: career, love, timing',
});

/**
 * Query-string schema for GET /api/moment/status
 */
export const statusQuerySchema = z.object({
  context: contextSchema,
});

/**
 * Request body schema for POST /api/moment/create
 */
export const createMomentSchema = z.object({
  context: contextSchema,
  ownerId: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Query-string schema for GET /api/moment/verify
 */
export const verifyQuerySchema = z.object({
  artifactCode: z.string().min(1, 'artifactCode is required'),
});

/**
 * Request body schema for POST /api/moment/seal
 */
export const sealMomentSchema = z.object({
  artifactCode: z.string().min(1, 'artifactCode is required'),
});

/**
 * Query-string schema for GET /api/moment/list
 */
export const listQuerySchema = z.object({
  context: contextSchema.optional(),
  status: z.enum(['PROCEED', 'HOLD', 'NOT NOW']).optional(),
  sealed: z
    .string()
    .transform((v) => {
      if (v === 'true') return true;
      if (v === 'false') return false;
      return undefined;
    })
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
});

export type ContextInput = z.infer<typeof contextSchema>;
export type CreateMomentInput = z.infer<typeof createMomentSchema>;
export type VerifyQueryInput = z.infer<typeof verifyQuerySchema>;
export type SealMomentInput = z.infer<typeof sealMomentSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
