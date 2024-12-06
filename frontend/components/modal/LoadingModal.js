"use client";

import React from "react";
import { useSelector } from "react-redux";

const LoadingModal = () => {
  const isModalOpen = useSelector((state) => state.loading.loading);

  return (
    isModalOpen && (
      <div className="fixed bg-black z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
        <p className="text-white font-italiana animate-pulse text-center text-7xl">
          Request <br /> Tasks
        </p>
      </div>
    )
  );
};

export default LoadingModal;
