"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import type { ICourse, IUser } from "@/app/types/lms";
import CourseCard from "../Course/CourseCard";

type ProfileProps = {
  user: IUser;
};

const Profile = ({ user }: ProfileProps) => {
  const [scroll, setScroll] = useState(false);
  const avatar: string | null = null;
  const [logout, setLogout] = useState(false);
  const { data } = useGetUsersAllCoursesQuery(undefined, {});
  const [active, setActive] = useState(1);

  useLogOutQuery(undefined, {
    skip: !logout,
  });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allCourses = (data as { courses?: ICourse[] } | undefined)?.courses;
  const userCourses = user?.courses;

  const courses = useMemo<ICourse[]>(() => {
    if (!allCourses || !userCourses) {
      return [];
    }
    return userCourses
      .map((userCourse) =>
        allCourses.find((course) => course._id === userCourse._id),
      )
      .filter((course): course is ICourse => course !== undefined);
  }, [allCourses, userCourses]);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-15 800px:w-77.5 h-112.5 bg-white/90 dark:bg-slate-900/90 border dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-xs dark:shadow-xs my-20 sticky ${
          scroll ? "top-30" : "top-7.5"
        } left-7.5`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      {active === 1 && (
        <div className="size-full bg-transparent mt-20">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="size-full bg-transparent mt-20">
          <ChangePassword />
        </div>
      )}

      {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-20">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-3 lg:gap-6.25 1500px:grid-cols-4 1500px:gap-8.75 mb-12 border-0">
            {courses.map((item) => (
              <CourseCard item={item} key={item._id} isProfile={true} />
            ))}
          </div>

          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
