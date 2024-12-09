"use client";

import { setBatchTasks, setProject, setTasks } from "@/redux/slice/boardSlice";
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
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { CurrencyManager } from "@requestnetwork/currency";
import { useWalletClient } from "wagmi";
import { useEthersProvider } from "@/utils/ethersProvider";
import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
  payBatchConversionProxyRequest,
  approveErc20BatchConversionIfNeeded,
} from "@requestnetwork/payment-processor";

export default function useBoard() {
  const dispatch = useDispatch();
  const { isConnected, chainId } = useAccount();
  const signer = useEthersSigner();
  const provider = useEthersProvider({
    chainId: sepolia.id,
  });
  const { switchChainAsync } = useSwitchChain();
  const project = useSelector((state) => state.board.project);
  const { data: walletClient } = useWalletClient();

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

  const changeStatusToSubmitted = async (task, sourceStatus, destStatus) => {
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

    const web3SignatureProvider = new Web3SignatureProvider(walletClient);

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    const payeeIdentity = signer._address;
    const payerIdentity = project.owner;
    const paymentRecipient = payeeIdentity;
    const feeRecipient = project.owner;

    const requestCreateParameters = {
      requestInfo: {
        // The currency in which the request is denominated
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
          network: "sepolia",
        },

        // The expected amount as a string, in parsed units, respecting `decimals`
        // Consider using `parseUnits()` from ethers or viem
        expectedAmount: (Number(task.bountyAmount) * 10 ** 6).toFixed(0),

        // The payee identity. Not necessarily the same as the payment recipient.
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeIdentity,
        },

        // The payer identity. If omitted, any identity can pay the request.
        payer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payerIdentity,
        },

        // The request creation timestamp.
        timestamp: Utils.getCurrentTimestampInSecond(),
      },

      // The paymentNetwork is the method of payment and related details.
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: "sepolia",
          paymentAddress: payeeIdentity,
          feeAddress: feeRecipient,
          feeAmount: "0",
        },
      },

      // The contentData can contain anything.
      // Consider using rnf_invoice format from @requestnetwork/data-format
      contentData: {
        taskId: task._id,
        projectId: project._id,
        payer: payerIdentity,
        payee: payeeIdentity,
      },

      // The identity that signs the request, either payee or payer identity.
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
    };

    const request = await requestClient.createRequest(requestCreateParameters);

    const confirmedRequestData = await request.waitForConfirmation();

    if (!confirmedRequestData) {
      throw new Error("Request not confirmed");
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/tasks/change-status",
      {
        id: task._id,
        sourceStatus,
        destStatus,
        requestId: confirmedRequestData.requestId,
      }
    );

    if (response.data.success) {
      await loadTasksByProjectId(project._id);
      toast.success("Task status changed to Submitted");
    } else {
      throw new Error(response.data.message);
    }
  };

  const approveAndPay = async (task) => {
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

      if (task.status !== "submitted") {
        toast.error("Invalid task status");
        return;
      }

      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
      });

      const request = await requestClient.fromRequestId(task?.requestId);
      let requestData = request.getData();

      const _hasSufficientFunds = await hasSufficientFunds({
        request: requestData,
        address: requestData.payer.value,
        providerOptions: {
          provider: provider,
        },
      });

      if (!_hasSufficientFunds) {
        toast.error("Insufficient funds");
        return;
      }

      const _hasErc20Approval = await hasErc20Approval(
        requestData,
        requestData.payer.value,
        signer
      );

      if (!_hasErc20Approval) {
        const approvalTx = await approveErc20(requestData, signer);
        await approvalTx.wait(2);
      }

      const paymentTx = await payRequest(requestData, signer);
      await paymentTx.wait(2);

      while (requestData.balance?.balance < requestData.expectedAmount) {
        requestData = await request.refresh();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await checkForCompletedTask(task);
      dispatch(setBatchTasks([]));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
    }
  };

  const checkForCompletedTask = async (task) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/tasks/check/" + task.requestId
      );

      if (response.data.success) {
        await loadTasksByProjectId(project._id);
        toast.success("Payment successful");
        dispatch(setBatchTasks([]));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const batchApproveAndPay = async (tasks) => {
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

      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
      });

      const currencyManager = CurrencyManager.getDefault();

      const enrichedRequests = await Promise.all(
        tasks.map(async (task) => {
          const request = await requestClient.fromRequestId(task.requestId);
          const requestData = await request.refresh();

          return {
            request: requestData,
            paymentSettings: {
              currency: {
                type: Types.RequestLogic.CURRENCY.ERC20,
                value: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
                network: "sepolia",
              },
            },
            paymentNetworkId:
              Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
          };
        })
      );

      await approveErc20BatchConversionIfNeeded(
        enrichedRequests[0].request,
        signer._address,
        signer,
        undefined,
        {
          currency: {
            type: Types.RequestLogic.CURRENCY.ERC20,
            value: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
            network: "sepolia",
          },
          maxToSpend: "0",
        },
        "0.1.0"
      );

      const tx = await payBatchConversionProxyRequest(
        enrichedRequests,
        signer,
        {
          skipFeeUSDLimit: true,
          conversion: {
            currencyManager: currencyManager,
          },
          version: "0.1.0",
        }
      );

      await tx.wait(2);

      await Promise.all(
        tasks.map(async (task) => {
          while (true) {
            const request = await requestClient.fromRequestId(task.requestId);
            const requestData = await request.refresh();

            if (requestData.balance?.balance >= requestData.expectedAmount) {
              await checkForCompletedTask(task);
              break;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        })
      );

      dispatch(setBatchTasks([]));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(setloading(false));
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
    approveAndPay,
    checkForCompletedTask,
    batchApproveAndPay,
  };
}
