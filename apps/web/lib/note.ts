import z from 'zod';

const note = z.object({
  id: z.string(),
  text: z.string(),
  color: z.string(),
  // Dimensions
  h: z.number().default(100),
  w: z.number().default(100),
  // Position
  x: z.number().default(0),
  y: z.number().default(0),
  z: z.number().default(0)
});

export type Note = z.infer<typeof note>;
