"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Send } from "lucide-react";
import { Button } from "@material-tailwind/react";

const Board = ({ params }) => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [], color: "red", canCreate: true },
    { id: "in-progress", title: "In Progress", tasks: [], color: "blue" },
    { id: "submitted", title: "Submitted", tasks: [], color: "orange" },
    { id: "paid", title: "Paid", tasks: [], color: "green" },
  ]);

  const [editingTask, setEditingTask] = useState({
    columnId: "",
    task: undefined,
  });

  const addTask = (columnId, task) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: [...col.tasks, { ...task, id: crypto.randomUUID() }],
            }
          : col
      )
    );
  };

  const deleteTask = (columnId, taskId) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const moveTask = (sourceColumnId, destColumnId, taskId) => {
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === taskId)
    );
    const taskToMove = sourceColumn?.tasks.find((task) => task.id === taskId);

    if (taskToMove) {
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== taskId),
            };
          }
          if (col.id === destColumnId) {
            return { ...col, tasks: [...col.tasks, taskToMove] };
          }
          return col;
        })
      );
    }
  };

  const updateTask = (columnId, updatedTask) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }
          : col
      )
    );
  };

  const renderTaskModal = () => {
    if (!editingTask.columnId) return null;

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
                  ...(prev.task || { id: "", title: "" }),
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
                  ...(prev.task || { id: "", title: "" }),
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
                  editingTask.task.id
                    ? updateTask(editingTask.columnId, editingTask.task)
                    : addTask(editingTask.columnId, {
                        title: editingTask.task.title,
                        description: editingTask.task.description,
                      });
                }
                setEditingTask({ columnId: "", task: undefined });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {editingTask.task?.id ? "Update" : "Add"} Task
            </button>
            <button
              onClick={() => setEditingTask({ columnId: "", task: undefined })}
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
      <div className="mb-6 flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between w-full">
        <div className="flex flex-col items-start justify-between">
          <h1 className="text-3xl font-extrabold">Project Axios</h1>
          <p className="opacity-60">
            Managed by <span className="font-semibold">0x9842...2312</span>
          </p>
        </div>
        <div className="flex flex-col sm:items-end items-start justify-center">
          <p className="text-lg opacity-60">13% completed</p>
          <div className="bg-secondary w-48 h-2 rounded-full mt-2 opacity-70">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: "13%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="w-full border-primary border opacity-10 mb-6 border-b-0 "></div>

      <div className="flex-1 min-w-[950px] overflow-x-auto hide-scroll">
        <div className="flex w-full space-x-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 rounded-lg w-[25%]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3 items-center">
                  <div
                    className={`w-2 h-2 rounded-full bg-${column.color}-500`}
                  />
                  <h2 className="text-md">{column.title}</h2>
                  <div className="flex items-center bg-primary opacity-70 text-secondary font-bold py-3 px-4 rounded-full text-xs w-5 h-3 justify-center">
                    {column.tasks.length}
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-secondary w-full p-3 rounded-xl gap-3">
                {column.canCreate && (
                  <Button
                    onClick={() =>
                      setEditingTask({ columnId: column.id, task: undefined })
                    }
                    className="bg-background text-sm font-normal text-primary normal-case flex items-center justify-center gap-2 rounded-lg"
                  >
                    <Plus className="text-blue-700 w-4" />{" "}
                    <p className="text-blue-700">Add New Task</p>
                  </Button>
                )}
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-100 p-3 rounded shadow-sm flex flex-col w-full overflow-hidden relative"
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("taskId", task.id)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-xl line-clamp-1">
                        {task.title}
                      </h3>
                      <div className="flex space-x-2">
                        {column.id !== "todo" && (
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

                    {column.id !== "paid" && column.id !== "submitted" && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() =>
                            setEditingTask({ columnId: column.id, task })
                          }
                          className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                        >
                          <Edit2 size={16} className="text-white size-3" />{" "}
                          <p>Edit</p>
                        </button>
                        <button
                          onClick={() => deleteTask(column.id, task.id)}
                          className="flex items-center bg-primary opacity-70 space-x-2 text-background font-bold py-4 px-5 rounded-full text-xs h-3 justify-center"
                        >
                          <Trash2 size={16} className="text-white size-3" />{" "}
                          <p>Delete</p>
                        </button>
                      </div>
                    )}

                    {column.id === "submitted" && (
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
                      {column.id === "todo" && (
                        <Button
                          className="py-2 bg-background normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                          onClick={() => {}}
                        >
                          Claim Task
                        </Button>
                      )}

                      {column.id === "in-progress" && (
                        <Button
                          className="py-2 bg-blue-500 normal-case border border-primary rounded-full text-background transition-colors duration-300"
                          onClick={() => {}}
                        >
                          Claimed
                        </Button>
                      )}

                      {column.id === "submitted" && (
                        <Button
                          className="py-2 bg-orange-500 normal-case border border-primary rounded-full text-primary transition-colors duration-300"
                          onClick={() => {}}
                        >
                          Verifying
                        </Button>
                      )}

                      {column.id === "paid" && (
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
                ))}
              </div>
              <div
                className="h-full min-h-[100px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const taskId = e.dataTransfer.getData("taskId");
                  const sourceColumnId = columns.find((col) =>
                    col.tasks.some((task) => task.id === taskId)
                  )?.id;

                  if (sourceColumnId && sourceColumnId !== column.id) {
                    moveTask(sourceColumnId, column.id, taskId);
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
