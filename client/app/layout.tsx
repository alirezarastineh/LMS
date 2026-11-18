"use client";

import "./globals.css";
import { useEffect, useSyncExternalStore } from "react";
import { Poppins, Josefin_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import socketIO from "socket.io-client";
import { ThemeProvider } from "./utils/theme-provider";
import { Providers } from "./Provider";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI ?? "";
const handleSocketConnect = () => undefined;
const noop = () => undefined;
const emptySubscribe = () => noop;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const useIsHydrated = () =>
  useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${josefin.variable} bg-white! bg-no-repeat dark:bg-linear-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
                <div>{children}</div>
              </Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

type CustomProps = Readonly<{
  children: React.ReactNode;
}>;

const Custom = ({ children }: CustomProps) => {
  const isHydrated = useIsHydrated();
  const { isLoading } = useLoadUserQuery(undefined, {
    skip: !isHydrated,
  });

  useEffect(() => {
    if (!ENDPOINT) {
      return;
    }

    const socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    socket.on("connection", handleSocketConnect);

    return () => {
      socket.off("connection", handleSocketConnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div>{!isHydrated || isLoading ? <Loader /> : <div>{children}</div>}</div>
  );
};
