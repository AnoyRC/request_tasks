import { query, mutation } from "./_generated/server.js";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    bountyAmount: v.number(),
    bountyCurrency: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      status: "todo",
      isClaimed: false,
      bountyAmount: args.bountyAmount,
      bountyCurrency: args.bountyCurrency,
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
    });
  },
});

export const deleteTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getTasksByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_projectId", (t) => t.eq("projectId", args.projectId))
      .collect();
  },
});

export const claimTask = mutation({
  args: {
    taskId: v.id("tasks"),
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      isClaimed: true,
      claimedBy: args.walletAddress,
    });
  },
});

export const changeStatusToInProgress = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);

    if (task.isClaimed === false) {
      throw new Error("Task must be claimed before it can be started");
    }

    if (task.status !== "todo") {
      throw new Error("Task must be in todo status before it can be started");
    }

    return await ctx.db.patch(args.taskId, {
      status: "in-progress",
    });
  },
});

export const changeStatusToSubmitted = mutation({
  args: {
    taskId: v.id("tasks"),
    requestId: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);

    if (task.status !== "in-progress") {
      throw new Error("Task must be in progress before it can be submitted");
    }

    return await ctx.db.patch(args.taskId, {
      status: "submitted",
      requestId: args.requestId,
    });
  },
});

export const changeStatusToPaid = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);

    if (task.status !== "submitted") {
      throw new Error("Task must be submitted before it can be paid");
    }

    return await ctx.db.patch(args.taskId, {
      status: "paid",
    });
  },
});

export const getTask = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
