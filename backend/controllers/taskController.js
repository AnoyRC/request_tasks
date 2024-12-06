import { ethers } from "ethers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

export const createTask = async (req, res) => {
  try {
    const {
      projectId,
      owner,
      title,
      description,
      bountyAmount,
      signature,
    } = req.body;

    if (
      !projectId ||
      !owner ||
      !title ||
      !description ||
      !bountyAmount ||
      !signature
    ) {
      return res.json({
        success: false,
        message: "Please fill in all the fields",
      });
    }

    // Verify Signature
    const domain = {
      name: "RequestTasks",
      version: "1",
      chainId: 11155111,
      verifyingContract: ethers.constants.AddressZero,
    };

    const types = {
      Task: [
        { name: "projectId", type: "string" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "bountyAmount", type: "uint256" },
        { name: "bountyCurrency", type: "string" },
      ],
    };

    const message = {
      projectId,
      title,
      description,
      bountyAmount,
      bountyCurrency: "USDC",
    };

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const project = await client.query(api.project.getProject, {
      id: projectId,
    });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "You are not the owner of the project",
      });
    }

    const taskId = await client.mutation(api.task.createTask, {
      projectId,
      title,
      description,
      bountyAmount: Number(bountyAmount),
      bountyCurrency: "USDC",
    });

    res.json({
      success: true,
      message: "Task created successfully",
      taskId,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasksByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const tasks = await client.query(api.task.getTasksByProjectId, {
      projectId,
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { owner, id, title, description, signature } = req.body;

    if (!owner || !id || !title || !description || !signature) {
      return res.json({
        success: false,
        message: "Please fill in all the fields",
      });
    }

    const domain = {
      name: "RequestTasks",
      version: "1",
      chainId: 11155111,
      verifyingContract: ethers.constants.AddressZero,
    };

    const types = {
      UpdateTask: [
        { name: "id", type: "string" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
      ],
    };

    const message = {
      id,
      title,
      description,
    };

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const task = await client.query(api.task.getTask, {
      id,
    });

    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await client.query(api.project.getProject, {
      id: task.projectId,
    });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "You are not the owner of the project",
      });
    }

    await client.mutation(api.task.updateTask, {
      id,
      title,
      description,
    });

    res.json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { owner, id, signature } = req.body;

    if (!owner || !id || !signature) {
      return res.json({
        success: false,
        message: "Please fill in all the fields",
      });
    }

    const domain = {
      name: "RequestTasks",
      version: "1",
      chainId: 11155111,
      verifyingContract: ethers.constants.AddressZero,
    };

    const types = {
      DeleteTask: [{ name: "id", type: "string" }],
    };

    const message = {
      id,
    };

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const task = await client.query(api.task.getTask, {
      id,
    });

    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await client.query(api.project.getProject, {
      id: task.projectId,
    });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "You are not the owner of the project",
      });
    }

    await client.mutation(api.task.deleteTask, {
      id,
    });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const claimTask = async (req, res) => {
  try {
    const { owner, id, signature } = req.body;

    if (!owner || !id || !signature) {
      return res.json({
        success: false,
        message: "Please fill in all the fields",
      });
    }

    const domain = {
      name: "RequestTasks",
      version: "1",
      chainId: 11155111,
      verifyingContract: ethers.constants.AddressZero,
    };

    const types = {
      ClaimTask: [{ name: "id", type: "string" }],
    };

    const message = {
      id,
    };

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const task = await client.query(api.task.getTask, {
      id,
    });

    if (!task) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.claimedBy) {
      return res.json({
        success: false,
        message: "Task already claimed",
      });
    }

    await client.mutation(api.task.claimTask, {
      taskId: id,
      walletAddress: owner,
    });

    res.json({
      success: true,
      message: "Task claimed successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const changeTaskStatus = async (req, res) => {
  try {
    const {
      owner,
      id,
      sourceStatus,
      destStatus,
      signature,
      requestId,
    } = req.body;

    if (sourceStatus === "todo" && destStatus === "in-progress") {
      if (!owner || !id || !sourceStatus || !destStatus || !signature) {
        return res.json({
          success: false,
          message: "Please fill in all the fields",
        });
      }

      const domain = {
        name: "RequestTasks",
        version: "1",
        chainId: 11155111,
        verifyingContract: ethers.constants.AddressZero,
      };

      const types = {
        ChangeTaskStatus: [
          { name: "id", type: "string" },
          { name: "sourceStatus", type: "string" },
          { name: "destStatus", type: "string" },
        ],
      };

      const message = {
        id,
        sourceStatus,
        destStatus,
      };

      const recoveredAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        message,
        signature
      );

      if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
        return res.json({
          success: false,
          message: "Invalid signature",
        });
      }

      const client = new ConvexHttpClient(process.env.CONVEX_URL);

      const task = await client.query(api.task.getTask, {
        id,
      });

      if (!task) {
        return res.json({
          success: false,
          message: "Task not found",
        });
      }

      if (task.status !== sourceStatus) {
        return res.json({
          success: false,
          message: "Invalid task status",
        });
      }

      if (task.isClaimed === false) {
        return res.json({
          success: false,
          message: "Task is not claimed",
        });
      }

      if (task.claimedBy.toLowerCase() !== owner.toLowerCase()) {
        return res.json({
          success: false,
          message: "You have not claimed this task",
        });
      }

      await client.mutation(api.task.changeStatusToInProgress, {
        taskId: id,
      });

      return res.json({
        success: true,
        message: "Task status changed to in-progress",
      });
    } else if (sourceStatus === "in-progress" && destStatus === "submitted") {
      if (!id || !sourceStatus || !destStatus || !requestId) {
        return res.json({
          success: false,
          message: "Please fill in all the fields",
        });
      }

      const client = new ConvexHttpClient(process.env.CONVEX_URL);

      // Verify the Request ID

      const task = await client.query(api.task.getTask, {
        id,
      });

      if (!task) {
        return res.json({
          success: false,
          message: "Task not found",
        });
      }

      if (task.status !== sourceStatus) {
        return res.json({
          success: false,
          message: "Invalid task status",
        });
      }

      await client.mutation(api.task.changeStatusToSubmitted, {
        taskId: id,
        requestId,
      });

      return res.json({
        success: true,
        message: "Task status changed to submitted",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid status transition",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
