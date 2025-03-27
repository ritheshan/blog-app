import React from "react";
import Hero from "../home/Hero";
import Trending from "../home/Trending";
import Devotional from "../home/Devotional";
import Creator from "../home/Creator";

function Home() {
  return (
    <div>
      <Hero />
      <Trending />
      <Devotional />
      <Creator />
    </div>
  );
}

export default Home;
