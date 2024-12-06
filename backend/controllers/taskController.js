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
