import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { styles } from "@/app/styles/styles";
import { getApiErrorMessage } from "@/app/types/lms";
import type { CustomModalContentProps } from "@/app/utils/CustomModal";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import type { RootState } from "@/redux/features/store";

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification = ({ setRoute }: CustomModalContentProps) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const [activation] = useActivationMutation();

  const [invalidError, setInvalidError] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    try {
      await activation({
        activation_token: token,
        activation_code: verificationNumber,
      }).unwrap();
      toast.success("Account activated successfully");
      setRoute?.("Login");
    } catch (error: unknown) {
      setInvalidError(true);
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);

    const newVerifyNumber = { ...verifyNumber, [index]: value };

    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="size-20 rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`size-16.25 bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-hidden text-center ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#0000004a]"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button
          type="button"
          className={`${styles.button}`}
          onClick={() => {
            void verificationHandler();
          }}
        >
          Verify OTP
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?{" "}
        <button
          type="button"
          className="text-[#2190ff] pl-1 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => setRoute?.("Login")}
        >
          Sign in
        </button>
      </h5>
    </div>
  );
};

export default Verification;
