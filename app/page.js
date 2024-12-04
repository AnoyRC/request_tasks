import ConnectWalletButton from "@/components/ui/ConnectWalletButton";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center pt-48 gap-5 text-center">
      <h1 className="font-italiana text-5xl font-bold">
        Get Paid for completing tasks
      </h1>
      <p className=" opacity-60">
        Request Tasks is a kanban board for bounties. Create tasks, users claim
        them, <br /> and pay them when they are completed.
      </p>

      <ConnectWalletButton switchButton={true} />
    </div>
  );
}
