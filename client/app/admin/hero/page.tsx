"use client";

import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";
import EditHero from "../../components/Admin/Customization/EditHero";

type pageProps = {};

const page = ({}: pageProps) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="E-Learning - Admin"
          description="E-Learning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
