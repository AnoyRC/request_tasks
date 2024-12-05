import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    owner: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      owner: args.owner,
      title: args.title,
      description: args.description,
    });
  },
});

export const getProject = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAllProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});
