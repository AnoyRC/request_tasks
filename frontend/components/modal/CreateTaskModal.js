"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogBody,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { toggleCreateTaskModal } from "@/redux/slice/modalSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useBoard from "@/hooks/useBoard";
import { useParams } from "next/navigation";

export default function CreateTaskModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.createTaskModal);
  const isLoading = useSelector((state) => state.loading.loading);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");
  const { createTask } = useBoard();
  const params = useParams();

  const handleDrawer = () => {
    dispatch(toggleCreateTaskModal());
  };

  const handleBountyAmount = (e) => {
    if (isNaN(e.target.value)) return;
    if (e.target.value < 0) return;
    setBountyAmount(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="fixed bg-black z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
        <p className="text-white font-italiana animate-pulse text-center text-7xl">
          Request <br /> Tasks
        </p>
      </div>
    );
  }

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleDrawer}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="font-outfit bg-transparent items-center justify-center flex shadow-none"
    >
      <DialogBody className="text-primary flex flex-col gap-y-4 py-5 font-outfit rounded-3xl bg-secondary border border-[var(--primary)] w-full max-w-[24rem] px-5 pb-6">
        <p className="font-extrabold text-xl font-italiana text-center mb-1">
          Create Task
        </p>

        <Input
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-primary"
          labelProps={{
            className: "text-primary border-primary",
          }}
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-primary"
          labelProps={{
            className: "text-primary border-primary",
          }}
        />

        <Input
          type="text"
          label="Bounty Amount in USDC"
          value={bountyAmount}
          onChange={(e) => handleBountyAmount(e)}
          className="text-primary"
          labelProps={{
            className: "text-primary border-primary",
          }}
        />

        <div className="flex w-full justify-between">
          <Button
            onClick={() => {
              if (!title || !description || !bountyAmount) {
                toast.error("Please fill all fields");
                return;
              }
              createTask(params.id, title, description, bountyAmount);
            }}
            loading={isLoading}
            className="bg-primary border border-primary rounded-full text-secondary normal-case"
          >
            Create
          </Button>

          <Button
            onClick={() => {
              if (isLoading) return;
              dispatch(toggleCreateTaskModal());
            }}
            className="bg-secondary border border-primary rounded-full text-primary normal-case"
          >
            Cancel
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
