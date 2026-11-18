"use client";

import { useState } from "react";
import CourseInformation from "./CourseInformation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "../../../../redux/features/courses/coursesApi";
import {
  getApiErrorMessage,
  type ICourseDataItem,
  type ICourseFormInfo,
  type ICoursePayload,
  type ICourseTextItem,
} from "@/app/types/lms";

const CreateCourse = () => {
  const router = useRouter();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [active, setActive] = useState(0);

  const [courseInfo, setCourseInfo] = useState<ICourseFormInfo>({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    categories: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [benefits, setBenefits] = useState<ICourseTextItem[]>([
    { clientId: "benefit-0", title: "" },
  ]);

  const [prerequisites, setPrerequisites] = useState<ICourseTextItem[]>([
    { clientId: "prereq-0", title: "" },
  ]);

  const [courseContentData, setCourseContentData] = useState<ICourseDataItem[]>(
    [
      {
        clientId: "content-0",
        videoUrl: "",
        title: "",
        description: "",
        videoSection: "Untitled Section",
        videoLength: "",
        links: [
          {
            clientId: "link-0",
            title: "",
            url: "",
          },
        ],
        suggestion: "",
      },
    ]
  );

  const [courseData, setCourseData] = useState<ICoursePayload | null>(null);

  const handleSubmit = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));

    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoLength: courseContent.videoLength,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );

    const data: ICoursePayload = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,
    };
    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    if (!isLoading && courseData) {
      try {
        await createCourse(courseData).unwrap();
        toast.success("Course created successfully");
        router.push("/admin/courses");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}

        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
      <div className="w-[20%] mt-25 h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} />
      </div>
    </div>
  );
};

export default CreateCourse;
