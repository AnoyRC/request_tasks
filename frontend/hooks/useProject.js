"use client";

import { setloading } from "@/redux/slice/loadingSlice";
import { toggleCreateProjectModal } from "@/redux/slice/modalSlice";
import { setProjects } from "@/redux/slice/projectSlice";
import { useEthersSigner } from "@/utils/ethersSigner";
import axios from "axios";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

export default function useProject() {
  const { isConnected, chainId } = useAccount();
  const signer = useEthersSigner();
  const { switchChainAsync } = useSwitchChain();
  const dispatch = useDispatch();

  const createProject = async (title, description) => {
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
        Project: [
          { name: "owner", type: "address" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
        ],
      };

      const message = {
        owner: signer._address,
        title,
        description,
      };

      const signature = await signer._signTypedData(domain, types, message);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/projects/create",
        {
          owner: signer._address,
          title,
          description,
          signature,
        }
      );

      if (response.data.success) {
        toast.success("Project created successfully");

        await loadProjects();

        dispatch(toggleCreateProjectModal());
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/projects/all"
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setProjects(response.data.projects));

      return response.data.projects;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return {
    createProject,
    loadProjects,
  };
}
