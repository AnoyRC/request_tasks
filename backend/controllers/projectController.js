import { ethers } from "ethers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

export const createProject = async (req, res) => {
  try {
    const { owner, title, description, signature } = req.body;

    if (!owner || !title || !description || !signature) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Verify signature
    const domain = {
      name: "RequestTasks",
      version: "1",
      chainId: 11155111,
      verifyingContract: ethers.constants.AddressZero,
    };

    const types = {
      Project: [
        { name: "owner", type: "address" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
      ],
    };

    const message = {
      owner,
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

    // Create project
    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const projectId = await client.mutation(api.project.createProject, {
      owner,
      title,
      description,
    });

    res.json({
      success: true,
      projectId,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const project = await client.query(api.project.getProject, {
      id,
    });

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const client = new ConvexHttpClient(process.env.CONVEX_URL);

    const projects = await client.query(api.project.getAllProjects);

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
