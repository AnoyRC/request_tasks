"use client";

import useBoard from "@/hooks/useBoard";
import useUtils from "@/hooks/useUtils";
import { setProject } from "@/redux/slice/boardSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProjectHeader() {
  const params = useParams();
  const { fetchProject } = useBoard();
  const project = useSelector((state) => state.board.project);
  const { formatAddress } = useUtils();
  const tasks = useSelector((state) => state.board.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProject(null));
    if (params.id) fetchProject(params.id);
  }, [params.id]);

  return (
    <div className="mb-6 flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between w-full">
      <div className="flex flex-col items-start justify-between">
        <h1 className="text-3xl font-extrabold">{project?.title}</h1>
        <p className="opacity-60 w-[400px] line-clamp-2">
          {project?.description}
        </p>
      </div>
      <div className="flex flex-col sm:items-end items-start justify-center">
        <p className="text-lg opacity-60">
          {tasks.length === 0
            ? 0
            : (tasks.filter((task) => task?.status === "paid").length /
                tasks.length) *
              100}
          % completed
        </p>
        <div className="bg-secondary w-48 h-2 rounded-full mt-2 opacity-70">
          <div
            className="bg-primary h-full rounded-full"
            style={{
              width: `${
                tasks.length === 0
                  ? 0
                  : (tasks.filter((task) => task?.status === "paid").length /
                      tasks.length) *
                    100
              }%`,
            }}
          ></div>
        </div>
        <p className="opacity-60 mt-2">
          Managed by{" "}
          <span className="font-semibold">
            {project?.owner && formatAddress(project?.owner)}
          </span>
        </p>
      </div>
    </div>
  );
}
