import { Lato, Italiana } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import WagmiProvider from "@/providers/WagmiProvider";
import { Toaster } from "sonner";
import ConnectWalletModal from "@/components/modal/ConnectWalletModal";
import LoadingModal from "@/components/modal/LoadingModal";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-lato",
});

const italiana = Italiana({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-italiana",
});

export const metadata = {
  title: "Request Tasks",
  description: "Get paid for completing tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${italiana.variable} font-lato antialiased`}
      >
        <ReduxProvider>
          <WagmiProvider>
            <Toaster
              position="bottom-center"
              richColors
              toastOptions={{
                className: `flex items-center justify-center text-center rounded-2xl bg-black text-[var(--primary)] border border-[var(--primary)] ${lato.className}`,
              }}
            />
            <LoadingModal />
            <ConnectWalletModal />
            {children}
            <BackgroundAnimation />
          </WagmiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
