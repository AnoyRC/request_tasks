"use client";

import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import { toggleConnectModal } from "@/redux/slice/modalSlice";
import { useAccount, useConnect } from "wagmi";
import { useEffect } from "react";

export default function ConnectWalletModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.connectModal);
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const handleDrawer = () => {
    dispatch(toggleConnectModal());
  };

  useEffect(() => {
    if (isConnected && open) {
      dispatch(toggleConnectModal());
    }
  }, [isConnected]);

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
          Connect Wallet
        </p>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => {
              connect({ connector });
            }}
            className="bg-secondary border border-primary rounded-full text-primary "
          >
            {connector.name}
          </Button>
        ))}
      </DialogBody>
    </Dialog>
  );
}
