import ConnectWalletButton from "@/components/ui/ConnectWalletButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center pt-48 gap-5 text-center relative overflow-hidden">
      <h1 className="font-italiana text-5xl font-bold">
        Get Paid for completing tasks
      </h1>
      <p className=" opacity-60">
        Request Tasks is a kanban board for bounties. Create tasks, users claim
        them, <br /> and pay them when they are completed.
      </p>

      <Image
        src="/cover.png"
        width={1000}
        height={1000}
        alt="Hero Image"
        className="rounded-lg absolute -bottom-20"
      />

      <ConnectWalletButton switchButton={true} />
    </div>
  );
}
