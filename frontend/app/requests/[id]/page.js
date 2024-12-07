"use client";

import ConnectWalletButton from "@/components/ui/ConnectWalletButton";
import useBoard from "@/hooks/useBoard";
import useUtils from "@/hooks/useUtils";
import {
  setSelectedTask,
  toggleDeleteTaskModal,
} from "@/redux/slice/modalSlice";
import { Button } from "@material-tailwind/react";
import { ArrowLeft, RefreshCcw, Send, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

export default function Requests() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const params = useParams();
  const tasks = useSelector((state) => state.board.tasks);
  const { loadTasksByProjectId } = useBoard();
  const isTaskLoading = useSelector((state) => state.loading.taskLoading);
  const currentTask = useSelector((state) => state.loading.currentTask);
  const { formatAddress } = useUtils();
  const dispatch = useDispatch();

  useEffect(() => {
    if (params.id) {
      loadTasksByProjectId(params.id);
    }
  }, []);

  return (
    <div className="p-6 first-letter:bg-gray-100 h-screen overflow-y-hidden">
      <div className="mb-6 flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between w-full">
        <div className="flex flex-col items-start justify-between">
          <h1 className="text-4xl font-extrabold font-italiana">Requests</h1>
          <p className="text-gray-500">
            Task verification and payment management
          </p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Button
            className="bg-blue-500 border border-secondary rounded-full text-background flex items-center justify-center hover:bg-background hover:text-primary hover:border-primary transition-colors duration-300"
            onClick={() => {
              router.push(`/board/${params.id}`);
            }}
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Board
          </Button>

          {!isConnected && <ConnectWalletButton />}
        </div>
      </div>
      <div className="w-full border-primary border opacity-10 mb-6 border-b-0 "></div>

      <div className="flex flex-col w-full gap-5">
        <div className="w-full flex flex-wrap gap-4">
          {tasks.map(
            (task) =>
              task?.status === "submitted" && (
                <div
                  key={task._id}
                  className="bg-gray-100 p-3 rounded-xl border border-primary shadow-sm flex flex-col w-full overflow-hidden relative"
                >
                  {isTaskLoading && currentTask._id === task._id && (
                    <div className="absolute top-0 left-0 z-20 bg-white/20 h-full w-full backdrop-blur-md flex items-center justify-center">
                      <Loader2
                        size={50}
                        className="text-primary animate-spin"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl line-clamp-1">
                      {task.title}
                    </h3>
                    <div className="flex space-x-2">
                      {task.isClaimed && (
                        <div className="text-xs text-background bg-blue-500 rounded-full py-2 px-4">
                          {" "}
                          {formatAddress(task.claimedBy)}{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 text-left mt-3 line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => {}}
                      className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                    >
                      <Send size={16} className="text-white size-3" />{" "}
                      <p>Approve and Pay</p>
                    </button>

                    <button
                      onClick={() => {
                        dispatch(setSelectedTask(task));
                        dispatch(toggleDeleteTaskModal());
                      }}
                      className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                    >
                      <X size={16} className="text-white size-3" />{" "}
                      <p>Reject</p>
                    </button>

                    <button
                      onClick={() => {}}
                      className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                    >
                      <RefreshCcw size={16} className="text-white size-3" />{" "}
                    </button>
                  </div>

                  <div className="border border-primary my-3 opacity-30 w-full border-b-0 mx-auto" />

                  <div className="flex w-full justify-between">
                    <Button
                      className="py-2 bg-orange-500 normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                      onClick={() => {}}
                    >
                      Verifying
                    </Button>

                    <div className="bg-primary h-9 text-background flex items-center justify-center rounded-full text-xs opacity-70 px-3">
                      {task.bountyAmount} USDC
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
