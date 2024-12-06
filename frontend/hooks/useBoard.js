"use client";

import { setProject, setTasks } from "@/redux/slice/boardSlice";
import { setloading } from "@/redux/slice/loadingSlice";
import {
  toggleCreateTaskModal,
  toggleUpdateTaskModal,
  toggleDeleteTaskModal,
} from "@/redux/slice/modalSlice";
import { useEthersSigner } from "@/utils/ethersSigner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { useSwitchChain } from "wagmi";
import { ethers } from "ethers";

export default function useBoard() {
  const dispatch = useDispatch();
  const { isConnected, chainId } = useAccount();
  const signer = useEthersSigner();
  const { switchChainAsync } = useSwitchChain();
  const project = useSelector((state) => state.board.project);

  const fetchProject = async (_id) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/projects/get/" + _id
      );

      if (response.data.success) {
        dispatch(setProject(response.data.project));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const createTask = async (projectId, title, description, bountyAmount) => {
    try {
      dispatch(setloading(true));

      if (!isConnected) {
        toast.error("You need to connect your wallet first");
        return;
      }

      if (chainId !== 11155111) {
        toast.error("Invalid network");
        await switchChainAsync({
          chainId: sepolia.id,
        });
      }

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

      const signature = await signer._signTypedData(domain, types, message);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/create",
        {
          projectId,
          owner: signer._address,
          title,
          description,
          bountyAmount,
          signature,
        }
      );

      if (response.data.success) {
        toast.success("Task created successfully");
        await loadTasksByProjectId(projectId);
        dispatch(toggleCreateTaskModal());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const loadTasksByProjectId = async (projectId) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/get/all/" + projectId
      );

      if (response.data.success) {
        dispatch(setTasks(response.data.tasks));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateTask = async (id, title, description) => {
    try {
      dispatch(setloading(true));

      if (!isConnected) {
        toast.error("You need to connect your wallet first");
        return;
      }

      if (chainId !== 11155111) {
        toast.error("Invalid network");
        await switchChainAsync({
          chainId: sepolia.id,
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

      const signature = await signer._signTypedData(domain, types, message);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/update",
        {
          id,
          owner: signer._address,
          title,
          description,
          signature,
        }
      );

      if (response.data.success) {
        toast.success("Task updated successfully");
        await loadTasksByProjectId(project._id);
        dispatch(toggleUpdateTaskModal());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const deleteTask = async (id) => {
    try {
      dispatch(setloading(true));

      if (!isConnected) {
        toast.error("You need to connect your wallet first");
        return;
      }

      if (chainId !== 11155111) {
        toast.error("Invalid network");
        await switchChainAsync({
          chainId: sepolia.id,
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

      const signature = await signer._signTypedData(domain, types, message);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/delete",
        {
          id,
          owner: signer._address,
          signature,
        }
      );

      if (response.data.success) {
        toast.success("Task deleted successfully");
        await loadTasksByProjectId(project._id);
        dispatch(toggleDeleteTaskModal());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const claimTask = async (id) => {
    try {
      dispatch(setloading(true));

      if (!isConnected) {
        toast.error("You need to connect your wallet first");
        return;
      }

      if (chainId !== 11155111) {
        toast.error("Invalid network");
        await switchChainAsync({
          chainId: sepolia.id,
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

      const signature = await signer._signTypedData(domain, types, message);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/claim",
        {
          id,
          owner: signer._address,
          signature,
        }
      );

      if (response.data.success) {
        toast.success("Task claimed successfully");
        await loadTasksByProjectId(project._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const changeTaskStatusToInProgress = async (id, sourceStatus, destStatus) => {
    if (!isConnected) {
      toast.error("You need to connect your wallet first");
      throw new Error("You need to connect your wallet first");
    }

    if (chainId !== 11155111) {
      toast.error("Invalid network");
      await switchChainAsync({
        chainId: sepolia.id,
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

    const signature = await signer._signTypedData(domain, types, message);

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/tasks/change-status",
      {
        id,
        owner: signer._address,
        sourceStatus,
        destStatus,
        signature,
      }
    );

    if (response.data.success) {
      await loadTasksByProjectId(project._id);
      toast.success("Task status changed to In Progress");
    } else {
      throw new Error(response.data.message);
    }
  };

  const changeStatusToSubmitted = async (id, sourceStatus, destStatus) => {
    // requestID is hardcoded to 0x0
    const requestId = "0x0";

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/tasks/change-status",
      {
        id,
        sourceStatus,
        destStatus,
        requestId,
      }
    );

    if (response.data.success) {
      await loadTasksByProjectId(project._id);
      toast.success("Task status changed to Submitted");
    } else {
      throw new Error(response.data.message);
    }
  };

  return {
    fetchProject,
    createTask,
    updateTask,
    deleteTask,
    loadTasksByProjectId,
    claimTask,
    changeTaskStatusToInProgress,
    changeStatusToSubmitted,
  };
}
