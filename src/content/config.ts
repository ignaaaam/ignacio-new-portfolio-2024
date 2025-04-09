import { defineCollection, z } from 'astro:content';

// Define the schema for blog posts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Ignacio Amat Urbina'),
    publish_date: z.string().transform(str => new Date(str)),
    last_modified: z.string().transform(str => new Date(str)).optional(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }),
    tags: z.array(z.string()),
    is_draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    category: z.string().optional(),
    reading_time: z.number().optional(),
    canonical_url: z.string().url().optional(),
    seo: z.object({
      custom_title: z.string().optional(),
      custom_description: z.string().optional(),
      keywords: z.array(z.string()).optional()
    }).optional(),
  })
});

// Define the schema for project showcase
const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    technologies: z.array(z.string()),
    github_url: z.string().url().optional(),
    live_url: z.string().url().optional(),
    featured: z.boolean().default(false),
    date: z.string().transform(str => new Date(str)),
    is_draft: z.boolean().default(false)
  })
});

// Export the collections
export const collections = {
  'posts': blogCollection,
  'projects': projectCollection
}; 