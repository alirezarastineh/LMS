"use client";

import { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import About from "./About";
import Footer from "../components/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const activeItem = 2;
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="About us - E-Learning"
        description="E-Learning is a learning management system for helping programmers."
        keywords="programming"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Page;
