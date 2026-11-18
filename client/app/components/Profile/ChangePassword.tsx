import { useState, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/styles";
import { getApiErrorMessage } from "@/app/types/lms";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        await updatePassword({ oldPassword, newPassword }).unwrap();
        toast.success("Password changed successfully");
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error));
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-medium text-black dark:text-white pb-2">
        Change Password
      </h1>

      <div className="w-full">
        <form
          onSubmit={(e) => {
            void passwordChangeHandler(e);
          }}
          className="flex flex-col items-center"
        >
          <div className="w-full 800px:w-[60%] mt-5">
            <label
              htmlFor="old-password"
              className="block pb-2 text-black dark:text-white"
            >
              Enter your old password
            </label>

            <input
              id="old-password"
              aria-required="true"
              type="password"
              className={`${styles.input} w-[95%]! mb-4 800px:mb-0 text-black dark:text-white`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[60%] mt-2">
            <label
              htmlFor="new-password"
              className="block pb-2 text-black dark:text-white"
            >
              Enter your new password
            </label>

            <input
              id="new-password"
              aria-required="true"
              type="password"
              className={`${styles.input} w-[95%]! mb-4 800px:mb-0 text-black dark:text-white`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[60%] mt-2">
            <label
              htmlFor="confirm-password"
              className="block pb-2 text-black dark:text-white"
            >
              Enter your confirm password
            </label>

            <input
              id="confirm-password"
              aria-required="true"
              type="password"
              className={`${styles.input} w-[95%]! mb-4 800px:mb-0 text-black dark:text-white`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <input
              className={`w-[95%] h-10 border border-[#37a39a] text-center text-black dark:text-white rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
