"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ComponentType,
} from "react";
import { useSession } from "next-auth/react";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import CustomModal, { type CustomModalContentProps } from "../utils/CustomModal";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { getApiErrorMessage, type IUser } from "@/app/types/lms";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import Image from "next/image";
import Loader from "./Loader/Loader";

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png";

const AUTH_MODAL_COMPONENTS: Record<
  string,
  ComponentType<CustomModalContentProps>
> = {
  Login,
  "Sign-Up": Signup,
  Verification,
};

type HeaderUserAvatarProps = {
  user?: IUser;
  activeItem: number;
  avatarClassName: string;
  iconClassName: string;
  onOpenAuth: () => void;
};

const HeaderUserAvatar = ({
  user,
  activeItem,
  avatarClassName,
  iconClassName,
  onOpenAuth,
}: HeaderUserAvatarProps) => {
  if (!user) {
    return (
      <HiOutlineUserCircle
        size={25}
        className={iconClassName}
        onClick={onOpenAuth}
      />
    );
  }

  return (
    <Link href="/profile">
      <Image
        src={user.avatar?.url ?? DEFAULT_AVATAR_URL}
        alt=""
        width={30}
        height={30}
        className={avatarClassName}
        style={{
          border: activeItem === 5 ? "2px solid #37a39a" : "none",
        }}
      />
    </Link>
  );
};

type HeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header = ({
  open,
  setOpen,
  activeItem,
  route,
  setRoute,
}: HeaderProps) => {
  const [active, setActive] = useState(false);

  const [openSidebar, setOpenSidebar] = useState(false);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});

  const { data } = useSession();

  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  const shouldLogout = data === null && !isLoading && !userData;

  useLogOutQuery(undefined, {
    skip: !shouldLogout,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!userData && data) {
      void socialAuth({
        email: data?.user?.email,
        name: data?.user?.name,
        avatar: data.user?.image,
      });
      void refetch();
    }

    if (data === null && isSuccess) {
      toast.success("Login Successfully");
    }

    if (error) {
      toast.error(getApiErrorMessage(error));
    }
  }, [error, data, userData, isLoading, socialAuth, refetch, isSuccess]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const AuthModalComponent = AUTH_MODAL_COMPONENTS[route];

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-gray-900/50 bg-white dark:bg-linear-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-20 z-80 border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-20 z-80 dark:shadow-sm"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-20 flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-medium text-black dark:text-white`}
              >
                E-Learning
              </Link>
            </div>

            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />

              <ThemeSwitcher />

              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>

              <HeaderUserAvatar
                user={userData?.user}
                activeItem={activeItem}
                avatarClassName="size-7.5 rounded-full cursor-pointer"
                iconClassName="hidden 800px:block cursor-pointer dark:text-white text-black"
                onOpenAuth={() => setOpen(true)}
              />
            </div>
          </div>
        </div>

        {openSidebar && (
          <>
            <button
              type="button"
              aria-label="Close mobile menu"
              className="fixed w-full h-screen top-0 left-0 z-99999 dark:bg-[unset] bg-[#00000024] border-0 p-0"
              onClick={() => setOpenSidebar(false)}
            />
            <div className="w-[70%] fixed z-999999999 h-screen bg-white dark:bg-slate-900/90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />

              <HeaderUserAvatar
                user={userData?.user}
                activeItem={activeItem}
                avatarClassName="size-7.5 rounded-full ml-5 cursor-pointer"
                iconClassName="cursor-pointer ml-5 my-2 dark:text-white text-black"
                onOpenAuth={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright © 2024 E-Learning
              </p>
            </div>
          </>
        )}
      </div>

      {open && AuthModalComponent && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          component={AuthModalComponent}
          refetch={
            route === "Login"
              ? () => {
                  void refetch();
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default Header;
