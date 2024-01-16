"use client";

import { useState } from "react";
import Header from "./components/Header";
import Heading from "./utils/Heading";
import Hero from "./components/Route/Hero";

interface PageProps {}

const Page = ({}: PageProps) => {
  const [open, setOpen] = useState(false);

  const [activeItem] = useState(0);

  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="E-Learning"
        description="E-Learning is good"
        keyword="E-Learning is future"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Hero />
    </div>
  );
};

export default Page;
