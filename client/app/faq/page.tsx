"use client";

import { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ/FAQ";

type PageProps = {};

const Page = ({}: PageProps) => {
  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(4);

  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="FAQ - E-Learning"
        description="E-Learning is a learning management system for helping programmers."
        keywords="programming,MERN"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <br />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
