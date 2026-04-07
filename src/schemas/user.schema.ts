import { z } from 'zod'

export const DeleteAccountSchema = z.object({
  confirmation: z.literal('DELETE'),
})

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>
