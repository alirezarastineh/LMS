"use client";

import { useState } from "react";
import Header from "./components/Header";
import Heading from "./utils/Heading";
import Hero from "./components/Route/Hero";

interface PageProps {}

const Page = ({}: PageProps) => {
  const [open, setOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(0);

  return (
    <div>
      <Heading
        title="E-Learning"
        description="E-Learning is good"
        keyword="E-Learning is future"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Hero />

    </div>
  );
};

export default Page;
