"use client";
import Button from "./Button";
import { PiLightning } from "react-icons/pi";

const Hero = () => {
  //   const backend_url = "https://subtle-prepared-vulture.ngrok-free.app";

  const heading = "Let's Edit";
  const subHeading =
    "Next-Gen AI Image Editor: Seamless, Smart, and Intuitive Visual Editing";

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      <div className="relative z-10 h-dvh w-screen overflow-hidden ">
        <img
          src="black-background.jpg"
          alt="black background"
          className="absolute top-0 left-0 size-full z-20 object-cover object-center"
        />
      </div>
      <div className="absolute z-30 top-[56%] left-1/2 translate-x-[-50%] flex flex-col gap-6">
        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-medium w-full text-center break-words">
          {heading}
        </h1>
        <span className="text-white text-xl w-full text-center break-words">
          {subHeading}
        </span>
        <div className="text-white text-3xl flex gap-4 items-center justify-center">
          <Button
            id="launch-button"
            title="Try it Free"
            containerClass="bg-blue-50 flex items-center cursor-pointer justify-center gap-1"
            onClick={() => {}}
            disabled={false}
          />
          <Button
            id="launch-button"
            title="Go Pro"
            containerClass="bg-blue-50 flex items-center cursor-pointer justify-center gap-1 text-xl"
            leftIcon={<PiLightning />}
            onClick={() => {}}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
