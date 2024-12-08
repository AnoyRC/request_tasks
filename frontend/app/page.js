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
        className="rounded-lg absolute 2xl:-bottom-20 2xl:scale-100 -bottom-48 scale-50 lg:scale-75 lg:-bottom-48 xl:-bottom-32"
      />

      <ConnectWalletButton switchButton={true} />
    </div>
  );
}
