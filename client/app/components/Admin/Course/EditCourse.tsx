"use client";

import { useState } from "react";
import CourseInformation from "./CourseInformation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/features/courses/coursesApi";
import {
  createClientId,
  getApiErrorMessage,
  type ICourse,
  type ICourseDataItem,
  type ICourseFormInfo,
  type ICourseTextItem,
  type IEditCoursePayload,
} from "@/app/types/lms";

type EditCourseProps = {
  id: string;
};

type EditCourseFormProps = {
  editCourseData: ICourse;
};

const EditCourseForm = ({ editCourseData }: EditCourseFormProps) => {
  const router = useRouter();
  const [editCourse] = useEditCourseMutation();
  const [active, setActive] = useState(0);

  const [courseInfo, setCourseInfo] = useState<ICourseFormInfo>(() => ({
    name: editCourseData.name,
    description: editCourseData.description,
    price: editCourseData.price,
    estimatedPrice: editCourseData.estimatedPrice ?? "",
    tags: editCourseData.tags,
    level: editCourseData.level,
    categories: editCourseData.categories ?? "",
    demoUrl: editCourseData.demoUrl,
    thumbnail: editCourseData.thumbnail?.url ?? "",
  }));

  const [benefits, setBenefits] = useState<ICourseTextItem[]>(() =>
    editCourseData.benefits.map((b) => ({
      clientId: createClientId("benefit"),
      title: b.title,
    }))
  );

  const [prerequisites, setPrerequisites] = useState<ICourseTextItem[]>(() =>
    editCourseData.prerequisites.map((p) => ({
      clientId: createClientId("prereq"),
      title: p.title,
    }))
  );

  const [courseContentData, setCourseContentData] = useState<ICourseDataItem[]>(
    () =>
      editCourseData.courseData.map((item) => ({
        ...item,
        clientId: item._id ?? createClientId("content"),
        links: item.links.map((link) => ({
          ...link,
          clientId: createClientId("link"),
        })),
      }))
  );

  const [courseData, setCourseData] = useState<IEditCoursePayload | null>(null);

  const handleSubmit = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));

    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    const formattedCourseContentData: ICourseDataItem[] =
      courseContentData.map((courseContent) => ({
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
      }));

    const data: IEditCoursePayload = {
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
      courseContent: formattedCourseContentData,
    };

    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    if (!courseData) {
      return;
    }
    try {
      await editCourse({ id: editCourseData._id, data: courseData }).unwrap();
      toast.success("Course Updated successfully");
      router.push("/admin/courses");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-25 h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} />
      </div>
    </div>
  );
};

const EditCourse = ({ id }: EditCourseProps) => {
  const { data } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const editCourseData = (
    data as { courses?: ICourse[] } | undefined
  )?.courses?.find((i) => i._id === id);

  if (!editCourseData) {
    return null;
  }

  return <EditCourseForm key={editCourseData._id} editCourseData={editCourseData} />;
};

export default EditCourse;
