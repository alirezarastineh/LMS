"use client";

import { useState } from "react";
import Header from "./components/Header";
import Heading from "./utils/Heading";
import Hero from "./components/Route/Hero";
import Footer from "./components/Footer";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";

interface PageProps {}

const Page = ({}: PageProps) => {
  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(0);

  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="E-Learning"
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
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
