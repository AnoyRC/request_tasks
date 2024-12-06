"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Send,
  Loader2,
  X,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@material-tailwind/react";
import ProjectHeader from "@/components/layout/board/ProjectHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTask,
  toggleCreateTaskModal,
  toggleDeleteTaskModal,
  toggleUpdateTaskModal,
} from "@/redux/slice/modalSlice";
import useBoard from "@/hooks/useBoard";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { setTasks } from "@/redux/slice/boardSlice";
import { toast } from "sonner";
import { setCurrentTask, setTaskLoading } from "@/redux/slice/loadingSlice";
import useUtils from "@/hooks/useUtils";

const Board = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    loadTasksByProjectId,
    claimTask,
    changeTaskStatusToInProgress,
    changeStatusToSubmitted,
  } = useBoard();
  const tasks = useSelector((state) => state.board.tasks);
  const { address } = useAccount();
  const project = useSelector((state) => state.board.project);
  const isTaskLoading = useSelector((state) => state.loading.taskLoading);
  const currentTask = useSelector((state) => state.loading.currentTask);
  const { formatAddress } = useUtils();

  useEffect(() => {
    dispatch(setTasks([]));
    if (params.id) {
      loadTasksByProjectId(params.id);
    }
  }, []);

  const [columns, setColumns] = useState([
    {
      status: "todo",
      title: "To Do",
      tasks: [],
      color: "red",
      canCreate: true,
    },
    { status: "in-progress", title: "In Progress", tasks: [], color: "blue" },
    { status: "submitted", title: "Submitted", tasks: [], color: "orange" },
    { status: "paid", title: "Paid", tasks: [], color: "green" },
  ]);

  useEffect(() => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        tasks: tasks.filter((task) => task.status === col.status),
      }))
    );
  }, [tasks]);

  const moveTask = async (sourceStatus, destStatus, taskId) => {
    if (isTaskLoading) return;

    try {
      dispatch(setTaskLoading(true));

      if (!address) {
        toast.error("You need to connect your wallet first");
        return;
      }

      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task._id === taskId)
      );
      const taskToMove = sourceColumn?.tasks.find(
        (task) => task._id === taskId
      );

      dispatch(setCurrentTask(taskToMove));

      if (!taskToMove?.isClaimed) {
        toast.error("Task must be claimed before it can be moved");
        return;
      }

      if (taskToMove?.claimedBy !== address) {
        toast.error("You can't move a task you didn't claim");
        return;
      }

      if (sourceStatus === "todo" && destStatus !== "in-progress") {
        toast.error("Task can't be moved to this status");
        return;
      }

      if (sourceStatus === "in-progress" && destStatus !== "submitted") {
        toast.error("Task can't be moved to this status");
        return;
      }

      if (sourceStatus === "submitted") {
        toast.error("Task can't be moved to this status");
        return;
      }

      if (destStatus === "paid") {
        toast.error("Task can't be moved to paid status directly");
        return;
      }

      if (taskToMove) {
        setColumns((prevColumns) =>
          prevColumns.map((col) => {
            if (col.status === sourceStatus) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task._id !== taskId),
              };
            }
            if (col.status === destStatus) {
              return {
                ...col,
                tasks: [...col.tasks, { ...taskToMove, status: destStatus }],
              };
            }
            return col;
          })
        );
      }

      if (sourceStatus === "todo" && destStatus === "in-progress") {
        await changeTaskStatusToInProgress(taskId, sourceStatus, destStatus);
      }

      if (sourceStatus === "in-progress" && destStatus === "submitted") {
        await changeStatusToSubmitted(taskId, sourceStatus, destStatus);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);

      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task._id === taskId)
      );

      const taskToMove = sourceColumn?.tasks.find(
        (task) => task._id === taskId
      );

      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.status === sourceStatus) {
            return {
              ...col,
              tasks: [...col.tasks, taskToMove],
            };
          }
          if (col.status === destStatus) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task._id !== taskToMove._id),
            };
          }
          return col;
        })
      );
    } finally {
      dispatch(setTaskLoading(false));
    }
  };

  return (
    <div className="p-6 first-letter:bg-gray-100 h-screen overflow-y-hidden">
      <ProjectHeader />

      <div className="w-full border-primary border opacity-10 mb-6 border-b-0 "></div>

      <div className="flex-1 min-w-[950px] overflow-x-auto hide-scroll">
        <div className="flex w-full space-x-4">
          {columns.map((column) => (
            <div key={column.status} className="flex-1 rounded-lg w-[25%]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3 items-center">
                  <div
                    className={`w-2 h-2 rounded-full bg-${column.color}-500`}
                  />
                  <h2 className="text-md">{column.title}</h2>
                  <div className="flex items-center bg-primary opacity-70 text-secondary font-bold py-3 px-4 rounded-full text-xs w-5 h-3 justify-center">
                    {
                      tasks.filter((task) => task.status === column.status)
                        .length
                    }
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-secondary w-full p-3 rounded-xl gap-3">
                {column.canCreate && (
                  <Button
                    onClick={() => dispatch(toggleCreateTaskModal())}
                    className="bg-background text-sm font-normal text-primary normal-case flex items-center justify-center gap-2 rounded-lg"
                  >
                    <Plus className="text-blue-700 w-4" />{" "}
                    <p className="text-blue-700">Add New Task</p>
                  </Button>
                )}
                {column.tasks.map(
                  (task) =>
                    task?.status === column.status && (
                      <div
                        key={task._id}
                        className="bg-gray-100 p-3 rounded shadow-sm flex flex-col w-full overflow-hidden relative"
                        draggable
                        onDragStart={(e) =>
                          e.dataTransfer.setData("taskId", task._id)
                        }
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

                        {column.status !== "paid" &&
                          column.status !== "submitted" &&
                          project?.owner === address && (
                            <div className="flex space-x-2 mt-3">
                              <button
                                onClick={() => {
                                  dispatch(setSelectedTask(task));
                                  dispatch(toggleUpdateTaskModal());
                                }}
                                className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                              >
                                <Edit2
                                  size={16}
                                  className="text-white size-3"
                                />{" "}
                                <p>Edit</p>
                              </button>
                              <button
                                onClick={() => {
                                  dispatch(setSelectedTask(task));
                                  dispatch(toggleDeleteTaskModal());
                                }}
                                className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                              >
                                <Trash2
                                  size={16}
                                  className="text-white size-3"
                                />{" "}
                                <p>Delete</p>
                              </button>
                            </div>
                          )}

                        {column.status === "submitted" && (
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
                              <RefreshCcw
                                size={16}
                                className="text-white size-3"
                              />{" "}
                            </button>
                          </div>
                        )}

                        <div className="border border-primary my-3 opacity-30 w-full border-b-0 mx-auto" />

                        <div className="flex w-full justify-between">
                          {column.status === "todo" &&
                            task?.isClaimed === false && (
                              <Button
                                className="py-2 bg-background normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                                onClick={() => {
                                  claimTask(task._id);
                                }}
                              >
                                Claim Task
                              </Button>
                            )}

                          {(column.status === "todo" ||
                            column.status === "in-progress") &&
                            task?.isClaimed === true && (
                              <Button
                                className="py-2 bg-blue-500 normal-case border border-primary rounded-full text-background transition-colors duration-300"
                                onClick={() => {}}
                              >
                                Claimed
                              </Button>
                            )}

                          {column.status === "submitted" && (
                            <Button
                              className="py-2 bg-orange-500 normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                              onClick={() => {}}
                            >
                              Verifying
                            </Button>
                          )}

                          {column.status === "paid" && (
                            <Button
                              className="py-2 bg-green-500 normal-case border border-primary rounded-full text-background transition-colors duration-300"
                              onClick={() => {}}
                            >
                              Paid
                            </Button>
                          )}

                          <div className="bg-primary h-9 text-background flex items-center justify-center rounded-full text-xs opacity-70 px-3">
                            {task.bountyAmount} USDC
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div
                className="h-full min-h-[100px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const taskId = e.dataTransfer.getData("taskId");
                  const sourceColumn = columns.find((col) =>
                    col.tasks.some((task) => task._id === taskId)
                  );

                  if (sourceColumn && sourceColumn.status !== column.status) {
                    moveTask(sourceColumn.status, column.status, taskId);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
