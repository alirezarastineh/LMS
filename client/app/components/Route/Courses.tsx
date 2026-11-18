import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import type { ICourse } from "@/app/types/lms";
import CourseCard from "../Course/CourseCard";

const Courses = () => {
  const { data } = useGetUsersAllCoursesQuery({});

  const courses: ICourse[] = data?.courses ?? [];

  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <h1 className="text-center font-Poppins text-[25px]/8.75 sm:text-3xl lg:text-4xl dark:text-white 800px:leading-15! text-black font-bold tracking-tight">
          Expand Your Career <span className="text-gradient">Opportunity</span>
          <br />
          Opportunity With Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-3 lg:gap-6.25 1500px:grid-cols-4 1500px:gap-8.75 mb-12 border-0">
          {courses.map((item, index) => (
            <CourseCard item={item} key={item._id ?? index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
