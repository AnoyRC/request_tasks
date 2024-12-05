import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    owner: v.string(),
    title: v.string(),
    description: v.string(),
  }),
  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    status: v.string(),
    requestId: v.optional(v.string()),
    isClaimed: v.boolean(),
    claimedBy: v.optional(v.string()),
    bountyAmount: v.number(),
    bountyCurrency: v.string(),
  }).index("by_projectId", ["projectId"]),
});
