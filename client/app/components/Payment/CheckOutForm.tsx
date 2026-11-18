import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
import { styles } from "@/app/styles/styles";
import { getApiErrorMessage, type ICourse, type IUser } from "@/app/types/lms";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI ?? "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type CheckOutFormProps = {
  data: ICourse;
  user?: IUser;
  refetch: () => void;
};

const CheckOutForm = ({ data, user, refetch }: CheckOutFormProps) => {
  const router = useRouter();
  const stripe = useStripe();

  const elements = useElements();

  const [message, setMessage] = useState<string>("");

  const [createOrder] = useCreateOrderMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "Payment failed");
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      try {
        await createOrder({
          courseId: data._id,
          payment_info: paymentIntent,
        }).unwrap();
        refetch();
        socketId.emit("notification", {
          title: "New Order",
          message: `You have a new order from ${data.name}`,
          userId: user?._id,
        });
        router.push(`/course-access/${data._id}`);
      } catch (error_) {
        toast.error(getApiErrorMessage(error_));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="payment-form"
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <LinkAuthenticationElement id="link-authentication-element" />

      <PaymentElement id="payment-element" />

      <button type="submit" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 h-8.75!`}>
          {isLoading ? "Paying..." : "Pay now"}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;
