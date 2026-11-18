"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import type { ICategoryItem, ICourse } from "@/app/types/lms";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/styles";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

const CoursesContent = () => {
  const searchParams = useSearchParams();

  const search = searchParams?.get("title");

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});

  const [category, setCategory] = useState("All");

  const courses = useMemo<ICourse[]>(() => {
    const allCourses: ICourse[] = data?.courses ?? [];

    if (search) {
      return allCourses.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      return allCourses.filter((item) => item.categories === category);
    }

    return allCourses;
  }, [data?.courses, category, search]);

  const categories: ICategoryItem[] = categoriesData?.layout?.categories ?? [];

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - E-Learning"}
              description={"E-Learning is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <button
                type="button"
                className={`h-8.75 border-0 text-white ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </button>

              {categories.map((item, index) => (
                <div key={item._id ?? index}>
                  <button
                    type="button"
                    className={`h-8.75 border-0 text-white ${
                      category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"
                    } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                    onClick={() => setCategory(item.title)}
                  >
                    {item.title}
                  </button>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No courses found!"
                  : "No courses found in this category. Please try another one!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-3 lg:gap-6.25 1500px:grid-cols-4 1500px:gap-8.75 mb-12 border-0">
              {courses.map((item, index) => (
                <CourseCard item={item} key={item._id ?? index} />
              ))}
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

const Page = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Header
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
          activeItem={1}
        />
        <CoursesContent />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Page;
