import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import type { ICourse } from "@/app/types/lms";

type CourseDetailsPageProps = {
  id: string;
};

const CourseDetailsPage = ({ id }: CourseDetailsPageProps) => {
  const [route, setRoute] = useState("Login");

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetCourseDetailsQuery(id);

  const { data: config } = useGetStripePublishablekeyQuery({});

  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  const { data: userData } = useLoadUserQuery(undefined, {});

  const course = (data as { course?: ICourse } | undefined)?.course;
  const publishablekey = (
    config as { publishablekey?: string } | undefined
  )?.publishablekey;

  const stripePromise = useMemo(
    () => (publishablekey ? loadStripe(publishablekey) : null),
    [publishablekey]
  );

  const clientSecret =
    (paymentIntentData as { client_secret?: string } | undefined)
      ?.client_secret ?? "";

  useEffect(() => {
    if (course && userData?.user) {
      const amount = Math.round(course.price * 100);
      void createPaymentIntent(amount);
    }
  }, [createPaymentIntent, course, userData]);

  if (isLoading) {
    return <Loader />;
  }

  if (!course) {
    return null;
  }

  return (
    <div>
      <Heading
        title={`${course.name} - E-Learning`}
        description={
          "E-Learning is a programming community which is developed by Alireza Rastineh for helping programmers"
        }
        keywords={course.tags}
      />
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      {stripePromise && (
        <CourseDetails
          data={course}
          stripePromise={stripePromise}
          clientSecret={clientSecret}
          setRoute={setRoute}
          setOpen={setOpen}
        />
      )}
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
