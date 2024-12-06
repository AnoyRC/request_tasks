"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Send } from "lucide-react";
import { Button } from "@material-tailwind/react";
import ProjectHeader from "@/components/layout/board/ProjectHeader";
import { useDispatch, useSelector } from "react-redux";
import { toggleCreateTaskModal } from "@/redux/slice/modalSlice";
import useBoard from "@/hooks/useBoard";
import { useParams } from "next/navigation";

const Board = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { loadTasksByProjectId } = useBoard();
  const tasks = useSelector((state) => state.board.tasks);

  useEffect(() => {
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

  const [editingTask, setEditingTask] = useState({
    status: "",
    task: undefined,
  });

  useEffect(() => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        tasks: tasks.filter((task) => task.status === col.status),
      }))
    );
  }, [tasks]);

  const addTask = (status, task) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.status === status
          ? {
              ...col,
              tasks: [...col.tasks, { ...task, status: status }],
            }
          : col
      )
    );
  };

  const deleteTask = (status, taskId) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.status === status
          ? { ...col, tasks: col.tasks.filter((task) => task._id !== taskId) }
          : col
      )
    );
  };

  const moveTask = (sourceStatus, destStatus, taskId) => {
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task._id === taskId)
    );
    const taskToMove = sourceColumn?.tasks.find((task) => task._id === taskId);

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
  };

  const updateTask = (status, updatedTask) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.status === status
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
              ),
            }
          : col
      )
    );
  };

  const renderTaskModal = () => {
    if (!editingTask.status) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <input
            type="text"
            placeholder="Task Title"
            value={editingTask.task?.title || ""}
            onChange={(e) =>
              setEditingTask((prev) => ({
                ...prev,
                task: {
                  ...(prev.task || { _id: "", title: "" }),
                  title: e.target.value,
                },
              }))
            }
            className="w-full p-2 border rounded mb-4"
          />
          <textarea
            placeholder="Task Description (Optional)"
            value={editingTask.task?.description || ""}
            onChange={(e) =>
              setEditingTask((prev) => ({
                ...prev,
                task: {
                  ...(prev.task || { _id: "", title: "" }),
                  description: e.target.value,
                },
              }))
            }
            className="w-full p-2 border rounded mb-4 h-24"
          />
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (editingTask.task) {
                  editingTask.task._id
                    ? updateTask(editingTask.status, editingTask.task)
                    : addTask(editingTask.status, {
                        title: editingTask.task.title,
                        description: editingTask.task.description,
                        status: editingTask.status,
                      });
                }
                setEditingTask({ status: "", task: undefined });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {editingTask.task?._id ? "Update" : "Add"} Task
            </button>
            <button
              onClick={() => setEditingTask({ status: "", task: undefined })}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
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
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-xl line-clamp-1">
                            {task.title}
                          </h3>
                          <div className="flex space-x-2">
                            {column.status !== "todo" && (
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

                        {column.status !== "paid" &&
                          column.status !== "submitted" && (
                            <div className="flex space-x-2 mt-3">
                              <button
                                onClick={() =>
                                  setEditingTask({
                                    status: column.status,
                                    task,
                                  })
                                }
                                className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                              >
                                <Edit2
                                  size={16}
                                  className="text-white size-3"
                                />{" "}
                                <p>Edit</p>
                              </button>
                              <button
                                onClick={() =>
                                  deleteTask(column.status, task._id)
                                }
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
                          {column.status === "todo" && (
                            <Button
                              className="py-2 bg-background normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                              onClick={() => {}}
                            >
                              Claim Task
                            </Button>
                          )}

                          {column.status === "in-progress" && (
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
        {renderTaskModal()}
      </div>
    </div>
  );
};

export default Board;
