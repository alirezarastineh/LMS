import Image from "next/image";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { styles } from "../../../app/styles/styles";
import { getApiErrorMessage, resolveNonEmpty, type IUser } from "@/app/types/lms";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type ProfileInfoProps = {
  avatar: string | null;
  user: IUser;
};

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png";

const ProfileInfo = ({ avatar, user }: ProfileInfoProps) => {
  const [name, setName] = useState(user?.name ?? "");

  const [updateAvatar] = useUpdateAvatarMutation();

  const [editProfile] = useEditProfileMutation();

  const [loadUser, setLoadUser] = useState(false);

  useLoadUserQuery(undefined, { skip: !loadUser });

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      if (
        fileReader.readyState === 2 &&
        typeof fileReader.result === "string"
      ) {
        try {
          await updateAvatar(fileReader.result).unwrap();
          setLoadUser(true);
        } catch (error: unknown) {
          toast.error(getApiErrorMessage(error));
        }
      }
    };

    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name !== "") {
      try {
        await editProfile({ name }).unwrap();
        toast.success("Profile updated successfully!");
        setLoadUser(true);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      }
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={resolveNonEmpty(
              user?.avatar?.url,
              resolveNonEmpty(avatar, DEFAULT_AVATAR)
            )}
            alt=""
            width={120}
            height={120}
            priority={true}
            className="size-30 cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />

          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />

          <label htmlFor="avatar">
            <div className="size-7.5 bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-full">
              <label htmlFor="profile-full-name" className="block pb-2">
                Full Name
              </label>

              <input
                id="profile-full-name"
                type="text"
                className={`${styles.input} w-[95%]! mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-full pt-2">
              <label htmlFor="profile-email" className="block pb-2">
                Email Address
              </label>

              <input
                id="profile-email"
                type="text"
                readOnly
                className={`${styles.input} w-[95%]! mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>

            <input
              className={`w-full 800px:w-62.5 h-10 border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
