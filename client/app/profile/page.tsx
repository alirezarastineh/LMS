"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Profile from "../components/Profile/Profile";
import Footer from "../components/Footer";

type ProfilePageProps = {};

const Page = ({}: ProfilePageProps) => {
  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(5);

  const [route, setRoute] = useState("Login");

  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title={`${user?.name}'s Profile`}
          description="E-Learning is good"
          keywords="E-Learning is future"
        />

        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          route={route}
          setRoute={setRoute}
        />

        <Profile user={user} />

        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
