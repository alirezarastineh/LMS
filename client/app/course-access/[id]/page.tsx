"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import type { IUserCourseRef } from "@/app/types/lms";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (data?.user && !error) {
      const isAdmin = data.user.role === "admin";

      const isPurchased = data.user.courses.some(
        (item: IUserCourseRef) => item._id === id,
      );

      if (!isPurchased && !isAdmin) {
        redirect("/");
      }
      return;
    }

    redirect("/");
  }, [isLoading, data, error, id]);

  if (isLoading || !data?.user) {
    return <Loader />;
  }

  return (
    <div>
      <CourseContent id={id} user={data.user} />
    </div>
  );
};

export default Page;
