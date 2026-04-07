"use server"

import { db } from "@/lib/db"
import { actionClient } from "@/lib/safe-action"
import { NewsFiltersSchema } from "@/schemas/news.schema"
import { revalidatePath } from "next/cache"

export const getArticles = actionClient
  .schema(NewsFiltersSchema)
  .action(async ({ parsedInput: filters }) => {
    const skip = (filters.page - 1) * filters.limit

    const where = {
      ...(filters.sentiment && { sentiment: filters.sentiment }),
      ...(filters.impact && { impact: filters.impact }),
      ...(filters.sector && { sector: filters.sector }),
      ...(filters.source && { source: filters.source }),
    }

    try {
      const [articles, total] = await Promise.all([
        db.newsArticle.findMany({
          where,
          orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }],
          skip,
          take: filters.limit,
        }),
        db.newsArticle.count({ where }),
      ])

      return {
        articles,
        total,
        hasMore: skip + articles.length < total,
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      throw new Error("Failed to fetch news articles")
    }
  })

export const triggerNewsFetch = actionClient
  .action(async () => {
    // This could be restricted to admins or handled by cron
    // For now, we just expose the logic
    try {
      // In a real app, we might call the processor directly
      // but for demonstration, we assume cron handles it.
      // revalidatePath('/news')
      return { success: true }
    } catch (error) {
      throw new Error("Failed to trigger fetch")
    }
  })
