"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogBody,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { toggleCreateProjectModal } from "@/redux/slice/modalSlice";
import { useEffect, useState } from "react";
import useProject from "@/hooks/useProject";
import { toast } from "sonner";

export default function CreateProjectModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.createProjectModal);
  const { createProject } = useProject();
  const isLoading = useSelector((state) => state.loading.loading);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleDrawer = () => {
    dispatch(toggleCreateProjectModal());
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
          Create Project
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

        <div className="flex w-full justify-between">
          <Button
            onClick={() => {
              if (!title || !description) {
                toast.error("Please fill all fields");
                return;
              }
              createProject(title, description);
            }}
            loading={isLoading}
            className="bg-primary border border-primary rounded-full text-secondary normal-case"
          >
            Create
          </Button>

          <Button
            onClick={() => {
              if (isLoading) return;
              dispatch(toggleCreateProjectModal());
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
