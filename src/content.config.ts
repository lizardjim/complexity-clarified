import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./Content/Articles/Published"
    }),

    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),

        pillar: z.enum([
            "decisions",
            "leadership",
            "technology",
            "change"
        ]),

        tags: z.array(
            z.enum([
                "decisions",
                "leadership",
                "technology",
                "change",
                "digital-transformation",
                "ai",
                "strategy",
                "culture"
            ])
        ).default([]),

        published: z.boolean()
    })
});

export const collections = {
    articles
};