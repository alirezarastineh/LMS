"use client";
import { useCallback, useEffect, useMemo } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import type { INotification } from "@/app/types/lms";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI ?? "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type DashboardHeaderProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const DashboardHeader = ({ open, setOpen }: DashboardHeaderProps) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

  const audio = useMemo<HTMLAudioElement | null>(
    () =>
      typeof window === "undefined"
        ? null
        : new Audio(
            "https://res.cloudinary.com/kouroshrstn/video/upload/v1706010711/Notification%20Audio/notification_vcetjn_krvjlw.mp3"
          ),
    []
  );

  const notifications = useMemo<INotification[]>(
    () =>
      (data?.notifications ?? []).filter(
        (item: INotification) => item.status === "unread"
      ),
    [data?.notifications]
  );

  const playNotificationSound = useCallback(() => {
    void audio?.play().catch(() => undefined);
  }, [audio]);

  useEffect(() => {
    audio?.load();
  }, [audio]);

  useEffect(() => {
    const handleNewNotification = () => {
      void refetch();
      playNotificationSound();
    };
    socketId.on("newNotification", handleNewNotification);
    return () => {
      socketId.off("newNotification", handleNewNotification);
    };
  }, [playNotificationSound, refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id).unwrap();
    void refetch();
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-9999999">
      <ThemeSwitcher />
      <button
        type="button"
        aria-label="Toggle notifications"
        className="relative cursor-pointer m-2 bg-transparent border-0 p-0"
        onClick={() => setOpen?.(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full size-5 text-[12px] flex items-center justify-center text-white">
          {notifications.length}
        </span>
      </button>
      {open && (
        <div className="w-87.5 h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-1000000000 rounded-sm">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications.map((item) => (
            <div
              className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
              key={item._id}
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white">{item.title}</p>
                <button
                  type="button"
                  className="text-black dark:text-white cursor-pointer bg-transparent border-0 p-0"
                  onClick={() => {
                    void handleNotificationStatusChange(item._id);
                  }}
                >
                  Mark as read
                </button>
              </div>
              <p className="px-2 text-black dark:text-white">{item.message}</p>
              <p className="p-2 text-black dark:text-white text-[14px]">
                {format(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
