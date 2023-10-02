"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Maps() {
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<string>("default");

  const setmapToLocalStorage = (map: string) => {
    setSelectedMap(map);
    localStorage.setItem("map", map);
  };

  useEffect(() => {
    const map: string | null = localStorage.getItem("map");

    if (map) {
      setSelectedMap(map);
    }
  }, [selectedMap]);

  return (
    <main className="min-h-screen  grid place-content-center pt-14 bg-bg bg-cover">
      <div className="h-fit flex flex-col items-center gap-8 p-8 sm:gap-16  sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
        <div className="bg-[#4b5468a0]  rounded-[10px] p-4 ">
          <h3 className="text-[#B5B3BD] tracking-wide [word-spacing:3px] font-medium text-xl sm:text-3xl">
            selet the map
          </h3>
        </div>
        <div className="flex justify-center gap-8 items-center flex-col sm:flex-row w-full">
          <button
            onClick={() => { setmapToLocalStorage("football-mode")}}
            className={`flex flex-col items-center border-b-[5px] border-opacity-0  hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px] border-b-[#2DFCEE] rounded-b-[8px] ${
				selectedMap === "football-mode"
                ? "border-opacity-100 border-b-[#2DFCEE] rounded-b-[8px]"
                : ""
            }`}
          >
			<div className="max-w-[260px]">
				<Image
				width={260}
				height={260}
				alt="#"
				src="/game/football-map-select.svg"
				className="h-full w-full"
				/>
			</div>
            <p className="text-white text-center mt-[10px] font-bold">
              football-mode
            </p>
          </button>
          <button
           className={`flex flex-col items-center border-b-[5px] border-opacity-0  hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px] border-b-[#2DFCEE] rounded-b-[8px] ${
			   selectedMap === "space-mode"
			   ? "border-opacity-100 border-b-[#2DFCEE] rounded-b-[8px]"
			   : ""
			}`}
			onClick={() => setmapToLocalStorage("space-mode")}
          >
			<div className="max-w-[260px]">
				<Image
				width={260}
				height={0}
				alt="#"
				src="/game/space-map-select.svg"
				className="h-full w-full"
				/>
			</div>
            <p className="text-white text-center mt-[10px] font-bold">
              space-mode
            </p>
          </button>
          <button
          className={`flex flex-col items-center border-b-[5px] border-opacity-0  hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px] border-b-[#2DFCEE]  rounded-b-[8px] ${
			selectedMap === "default"
			? "border-opacity-100 border-b-[#2DFCEE] rounded-b-[8px]"
			: ""
		 }`}
            onClick={() => setmapToLocalStorage("default")}
          >
			<div className="max-w-[260px]">
				<Image
				width={260}
				height={0}
				alt="#"
				src="/game/default-map-select.svg"
				className="h-full w-full"
				/>
			</div>
            <p className="text-white text-center mt-[10px] font-bold">
              default
            </p>
          </button>
        </div>
        <button
          className="text-white text-3xl bg-red  py-2 px-8 sm:px-16 rounded-[10px] hover:bg-[#FBACB3] font-bold"
          onClick={() => {
            router.push("/game/match");
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
}
