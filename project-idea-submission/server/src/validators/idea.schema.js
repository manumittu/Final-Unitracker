import { z } from 'zod'

export const ideaCreateSchema = z.object({
  title: z.string().min(3),
  domain: z.enum(['Web','Mobile','AI/ML','IoT','Security','Cloud']),
  problemStatement: z.string().min(10),
  objectives: z.string().min(5),
  teamMembers: z.preprocess(v => typeof v === 'string' ? v.split(',').map(s=>s.trim()).filter(Boolean) : v, z.array(z.string()).default([])),
  supervisor: z.string().min(3),
  status: z.enum(['Draft','Submitted','Approved','Rejected']).default('Draft'),
  tags: z.preprocess(v => typeof v === 'string' ? v.split(',').map(s=>s.trim()).filter(Boolean) : v, z.array(z.string()).default([])),
  submissionDate: z.coerce.date().optional(),
})

export const ideaUpdateSchema = ideaCreateSchema.partial()
