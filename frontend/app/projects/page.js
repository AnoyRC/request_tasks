"use client";

import ConnectWalletButton from "@/components/ui/ConnectWalletButton";
import useProject from "@/hooks/useProject";
import useUtils from "@/hooks/useUtils";
import { toggleCreateProjectModal } from "@/redux/slice/modalSlice";
import { Button } from "@material-tailwind/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

export default function Project() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const project = useSelector((state) => state.project.projects);
  const { loadProjects } = useProject();
  const dispatch = useDispatch();
  const { formatAddress } = useUtils();

  useEffect(() => {
    // Fetch projects
    loadProjects();
  }, []);

  return (
    <div className="p-6 first-letter:bg-gray-100 h-screen overflow-y-hidden">
      <div className="mb-6 flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between w-full">
        <div className="flex flex-col items-start justify-between">
          <h1 className="text-4xl font-extrabold font-italiana">Projects</h1>
          <p className="text-gray-500">Create and manage your projects</p>
        </div>
        <div className="flex items-center justify-center">
          {!isConnected && <ConnectWalletButton />}

          {isConnected && (
            <Button
              className="bg-blue-500 border border-secondary rounded-full text-background flex items-center justify-center hover:bg-background hover:text-primary hover:border-primary transition-colors duration-300"
              onClick={() => {
                dispatch(toggleCreateProjectModal());
              }}
            >
              Create <Plus size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>

      <div className="w-full border-primary border opacity-10 mb-6 border-b-0 "></div>

      <div className="w-full flex flex-wrap gap-4">
        {project.map((project) => (
          <div
            key={project._id}
            className="bg-white w-[24%] min-w-[300px] hover:shadow-lg hover:cursor-pointer border-black border p-3 rounded-xl shadow-sm flex flex-col overflow-hidden relative"
            onClick={() => {
              router.push(`/board/${project._id}`);
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl line-clamp-1">
                {project.title}
              </h3>
            </div>
            {project.description && (
              <p className="text-sm text-gray-600 text-left mt-2 line-clamp-3">
                {project.description}
              </p>
            )}

            <div className="border border-primary my-3 opacity-30 w-full border-b-0 mx-auto" />

            <div className="flex w-full items-center space-x-2">
              <p className="text-sm opacity-60">Managed by</p>
              <div className="bg-primary w-fit h-9 text-background flex items-center justify-center rounded-full text-xs opacity-70 px-3">
                {formatAddress(project.owner)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
