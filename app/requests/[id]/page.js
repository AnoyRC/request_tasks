"use client";

import ConnectWalletButton from "@/components/ui/ConnectWalletButton";
import { Button } from "@material-tailwind/react";
import { ArrowLeft, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function Requests() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const params = useParams();

  const task = [
    {
      id: 1,
      status: "todo",
      title: "Task Axios",
      description: "A task for Axios",
      owner: "0x1234...7890",
    },
    {
      id: 2,
      status: "submitted",
      title: "Task Axios",
      description: "A task for Axios",
      owner: "0x1234...7890",
    },
    {
      id: 3,
      status: "paid",
      title: "Task Axios",
      description: "A task for Axios",
      owner: "0x1234...7890",
    },
  ];

  return (
    <div className="p-6 first-letter:bg-gray-100 h-screen overflow-y-hidden">
      <div className="mb-6 flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between w-full">
        <div className="flex flex-col items-start justify-between">
          <h1 className="text-4xl font-extrabold font-italiana">Requests</h1>
          <p className="text-gray-500">
            Task verification and payment management
          </p>
        </div>
        <div className="flex items-center justify-center">
          {!isConnected && <ConnectWalletButton />}
          {isConnected && (
            <Button
              className="bg-blue-500 border border-secondary rounded-full text-background flex items-center justify-center hover:bg-background hover:text-primary hover:border-primary transition-colors duration-300"
              onClick={() => {
                router.push(`/board/${params.id}`);
              }}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Board
            </Button>
          )}
        </div>
      </div>
      <div className="w-full border-primary border opacity-10 mb-6 border-b-0 "></div>
      {isConnected && (
        <div className="w-full flex flex-wrap gap-4">
          {task.map((task) =>
            task.status === "submitted" ? (
              <div
                key={task.id}
                className="bg-white w-[24%] hover:shadow-lg hover:cursor-pointer border-black border p-3 rounded-xl shadow-sm flex flex-col overflow-hidden relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl line-clamp-1">
                    {task.title}
                  </h3>
                  <div className="flex space-x-2">
                    {task.id !== "todo" && (
                      <div className="text-xs text-background bg-blue-500 rounded-full py-2 px-4">
                        {" "}
                        0x3323...342d{" "}
                      </div>
                    )}
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 text-left mt-3 line-clamp-3">
                    {task.description}
                  </p>
                )}

                {task.status === "submitted" && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => {}}
                      className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                    >
                      <Send size={16} className="text-white size-3" />{" "}
                      <p>Approve and Pay</p>
                    </button>
                  </div>
                )}

                <div className="border border-primary my-3 opacity-30 w-full border-b-0 mx-auto" />

                <div className="flex w-full justify-between">
                  {task.status === "todo" && (
                    <Button
                      className="py-2 bg-background normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                      onClick={() => {}}
                    >
                      Claim Task
                    </Button>
                  )}

                  {task.status === "submitted" && (
                    <Button
                      className="py-2 bg-orange-500 normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                      onClick={() => {}}
                    >
                      Verifying
                    </Button>
                  )}

                  {task.status === "paid" && (
                    <Button
                      className="py-2 bg-green-500 normal-case border border-primary rounded-full text-background transition-colors duration-300"
                      onClick={() => {}}
                    >
                      Paid
                    </Button>
                  )}

                  <div className="bg-primary h-9 text-background flex items-center justify-center rounded-full text-xs opacity-70 px-3">
                    2 ETH
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
      z
    </div>
  );
}
