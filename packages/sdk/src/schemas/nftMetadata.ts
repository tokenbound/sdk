import { z } from 'zod'

export const MetadataURISchema = z.string()

export const AttributeSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.number()]),
})

export const NFTMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  attributes: z.array(AttributeSchema).optional(),
})