"use server"

import { db } from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"
import { AlertPreferenceSchema } from "@/schemas/alerts.schema"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export const updateAlertPreferences = authActionClient
  .schema(AlertPreferenceSchema)
  .action(async ({ parsedInput: input, ctx: { userId } }) => {
    try {
      const result = await db.alertPreference.upsert({
        where: { userId },
        update: {
          sectors: input.sectors,
          minImpact: input.minImpact,
          enabled: input.enabled,
        },
        create: {
          userId,
          sectors: input.sectors,
          minImpact: input.minImpact,
          enabled: input.enabled,
        },
      })

      revalidatePath("/settings")
      return { success: true, preference: result }
    } catch (error) {
      console.error("Error updating preferences:", error)
      throw new Error("Failed to update alert preferences")
    }
  })

export const getAlertPreferences = authActionClient
  .action(async ({ ctx: { userId } }) => {
    try {
      const preference = await db.alertPreference.findUnique({
        where: { userId },
      })

      return { preference }
    } catch (error) {
      console.error("Error fetching preferences:", error)
      throw new Error("Failed to fetch preferences")
    }
  })

export const deleteUserAccount = authActionClient
  .action(async ({ ctx: { userId } }) => {
    try {
      // In a real application, you might want to handle data deletion more carefully
      // or implement a soft-delete mechanism
      await db.user.delete({
        where: { id: userId },
      })

      // revalidatePath and redirect handles on the client
      return { success: true }
    } catch (error) {
      console.error("Error deleting account:", error)
      throw new Error("Failed to delete account")
    }
  })
