"use client";

import React, { useState } from "react";
import { FolderGit2, GitPullRequest, PowerIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useDispatch } from "react-redux";
import { toggleConnectModal } from "@/redux/slice/modalSlice";
import useUtils from "@/hooks/useUtils";

const Sidebar = ({}) => {
  const params = useParams();

  const sidebarItems = [
    { icon: FolderGit2, name: "Projects", key: "projects" },
    { icon: GitPullRequest, name: "Requests", key: `requests/${params.id}` },
  ];

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch();
  const { formatAddress } = useUtils();

  const router = useRouter();

  return (
    <div className="bg-gray-900 w-16 hover:w-48 transition-all px-3 duration-300 h-screen flex flex-col items-center py-4 gap-y-2 group">
      <div
        className="mb-4 ml-2 cursor-pointer hidden items-center font-italiana group-hover:flex duration-300 transition-all text-background text-4xl mt-2"
        onClick={() => {
          router.push("/");
        }}
      >
        Request Tasks
      </div>

      <div className="mb-2 cursor-pointer flex items-center font-italiana group-hover:hidden duration-300 transition-all text-background text-4xl mt-2">
        R
      </div>

      {sidebarItems.map((item) => (
        <div
          key={item.key}
          onClick={() => {
            router.push(`/${item.key}`);
          }}
          className={`
            relative flex items-center p-2 w-full rounded-lg px-[10px] cursor-pointer transition-all duration-300
            hover:bg-gray-800
          `}
        >
          <item.icon size={24} className="text-gray-400" />
          <span
            className={`
            absolute left-10 text-white px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
          `}
          >
            {item.name}
          </span>
        </div>
      ))}
      <div className="w-full flex-col flex flex-1 justify-end">
        {isConnected && (
          <div className="w-full flex flex-col gap-2">
            <div
              className={`
            relative flex items-center p-2 ml-1 group-hover:ml-1.5 pr-0 w-full rounded-lg px-[10px] transition-all duration-300
    
          `}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 relative">
                <div className="w-3 h-3 rounded-full bg-green-500 absolute animate-ping"></div>
              </div>
              <span
                className={`
            absolute left-[2.2rem] text-white px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          `}
              >
                {formatAddress(address)}
              </span>
            </div>

            <div
              onClick={() => {
                disconnect();
              }}
              className={`
            relative flex items-center p-2 w-full rounded-lg px-[10px]  hover:bg-gray-800 cursor-pointer transition-all duration-300
    
          `}
            >
              <PowerIcon size={24} className="text-red-500" />
              <span
                className={`
            absolute left-10 text-white px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          `}
              >
                Logout
              </span>
            </div>
          </div>
        )}
        {!isConnected && (
          <div
            onClick={() => {
              dispatch(toggleConnectModal());
            }}
            className={`
            relative flex items-center p-2 w-full rounded-lg px-[10px]  hover:bg-gray-800 cursor-pointer transition-all duration-300
    
          `}
          >
            <PowerIcon size={24} className="text-blue-500" />
            <span
              className={`
            absolute left-10 text-white px-2 py-1 rounded
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          `}
            >
              Connect
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
