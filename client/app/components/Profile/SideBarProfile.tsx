import Image from "next/image";
import Link from "next/link";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { resolveNonEmpty, type IUser } from "@/app/types/lms";

type SideBarProfileProps = {
  user: IUser;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: () => void | Promise<void>;
};

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png";

const SideBarProfile = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}: SideBarProfileProps) => {
  return (
    <div className="w-full">
      <button
        type="button"
        className={`w-full text-left border-0 flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={resolveNonEmpty(
            user?.avatar?.url,
            resolveNonEmpty(avatar, DEFAULT_AVATAR)
          )}
          alt=""
          width={20}
          height={20}
          className="size-5 800px:size-7.5 cursor-pointer rounded-full"
        />

        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </button>

      <button
        type="button"
        className={`w-full text-left border-0 flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="dark:text-white text-black" />

        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Change Password
        </h5>
      </button>

      <button
        type="button"
        className={`w-full text-left border-0 flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white text-black" />

        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Courses
        </h5>
      </button>

      {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 6 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
          }`}
          href={"/admin"}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="dark:text-white text-black"
          />

          <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </Link>
      )}

      <button
        type="button"
        className={`w-full text-left border-0 flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        }`}
        onClick={() => {
          void logOutHandler();
        }}
      >
        <AiOutlineLogout size={20} className="dark:text-white text-black" />

        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Log Out
        </h5>
      </button>
    </div>
  );
};

export default SideBarProfile;
