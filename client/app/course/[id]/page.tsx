"use client";

import { useParams } from "next/navigation";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
