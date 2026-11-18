import { styles } from "@/app/styles/styles";
import type { ICourse } from "@/app/types/lms";
import type { Stripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import { Elements } from "@stripe/react-stripe-js";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import CourseContentList from "../Course/CourseContentList";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type CourseDetailsProps = {
  data: ICourse;
  stripePromise: Promise<Stripe | null> | null;
  clientSecret: string;
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: CourseDetailsProps) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const user = userData?.user;

  const [open, setOpen] = useState(false);

  const estimatedPrice = data.estimatedPrice ?? 0;
  const dicountPercentenge =
    estimatedPrice > 0
      ? ((estimatedPrice - data.price) / estimatedPrice) * 100
      : 0;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const isPurchased = user?.courses?.find((item) => item._id === data._id);

  const isAdmin = user?.role === "admin";

  const handleOrder = () => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings ?? 0} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>

            <br />
            <h1 className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={item.title}
                >
                  <div className="w-3.75 mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item) => (
              <div
                className="w-full flex 800px:items-center py-2"
                key={item.title}
              >
                <div className="w-3.75 mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-semibold text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-5 whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data.ratings ?? 0} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data.ratings ?? 0)
                    ? (data.ratings ?? 0).toFixed(1)
                    : (data.ratings ?? 0).toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {[...(data?.reviews ?? [])].reverse().map((item) => (
                <div className="w-full pb-4" key={item._id}>
                  <div className="flex">
                    <div className="size-12.5">
                      <Image
                        src={
                          item.user?.avatar
                            ? item.user.avatar.url
                            : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                        }
                        width={50}
                        height={50}
                        alt=""
                        className="size-12.5 rounded-full object-cover"
                      />
                    </div>
                    <div className="hidden 800px:block pl-2">
                      <div className="flex items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user?.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-black dark:text-white">
                        {item.comment}
                      </p>
                      <small className="text-[#000000d1] dark:text-[#ffffff83]">
                        {item.createdAt ? format(item.createdAt) : ""} •
                      </small>
                    </div>
                    <div className="pl-2 flex 800px:hidden items-center">
                      <h5 className="text-[18px] pr-2 text-black dark:text-white">
                        {item.user?.name}
                      </h5>
                      <Ratings rating={item.rating} />
                    </div>
                  </div>
                  {item.commentReplies?.map((i) => (
                    <div
                      className="w-full flex 800px:ml-16 my-5"
                      key={
                        i._id ??
                        `${i.user?._id ?? "user"}-${i.createdAt ?? i.comment ?? ""}`
                      }
                    >
                      <div className="size-12.5">
                        <Image
                          src={
                            i.user?.avatar
                              ? i.user.avatar.url
                              : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="size-12.5 rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{i.user?.name}</h5>{" "}
                          <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                        </div>
                        <p>{i.comment}</p>
                        <small className="text-[#ffffff83]">
                          {i.createdAt ? format(i.createdAt) : ""} •
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-25 left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.name} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : `${data.price}€`}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}€
                </h5>

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentengePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased || isAdmin ? (
                  <Link
                    className={`${styles.button} w-45! my-3 font-Poppins cursor-pointer bg-[crimson]!`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`${styles.button} w-45! my-3 font-Poppins cursor-pointer bg-[crimson]! border-0`}
                    onClick={handleOrder}
                  >
                    Buy Now {data.price}€
                  </button>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
          <div className="w-125 min-h-125 bg-white rounded-xl shadow-sm p-3">
            <div className="w-full flex justify-end">
              <IoCloseOutline
                size={40}
                className="text-black cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="w-full">
              {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckOutForm
                    data={data}
                    user={user}
                    refetch={() => {
                      void refetch();
                    }}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
