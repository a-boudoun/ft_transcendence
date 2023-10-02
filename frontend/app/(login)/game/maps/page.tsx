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
      <div className="flex flex-col items-center gap-8 p-8 sm:gap-16  sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
        <div className="bg-[#4b5468a0] rounded-[10px] p-4 ">
          <h3 className="text-[#B5B3BD] tracking-wide [word-spacing:3px] font-medium text-xl sm:text-3xl">
            selet the map
          </h3>
        </div>
        <div className="flex justify-center gap-8 items-center flex-col sm:flex-row">
          <button
            onClick={() => {
              setmapToLocalStorage("football-mode");
            }}
            className={`flex flex-col items-center gap-4`}
          >
            <div
              className={`${
                selectedMap === "football-mode"
                  ? "shadow-[0_20px_50px_rgba(_89,_203,_76,_1)]  "
                  : " "
              } rounded-xl max-w-[260px] hover:shadow-[0_20px_50px_rgba(_89,_203,_76,_1)] overflow-hidden`}
            >
              <Image
                width={260}
                height={0}
                alt="football-mode"
                src="/game/football-map-select.webp"
                className={`h-full w-full transition-transform ${
                  selectedMap === "football-mode" ? "scale-110" : ""
                } hover:scale-110`}
              />
            </div>
            <span className="font-bold">Football</span>
          </button>
          <button
            onClick={() => {
              setmapToLocalStorage("space-mode");
            }}
            className={`flex flex-col items-center gap-4`}
          >
            <div
              className={`${
                selectedMap === "space-mode"
                  ? "shadow-[0_20px_50px_rgba(_179,_54,_144,_1)]"
                  : " "
              } rounded-xl max-w-[260px] hover:shadow-[0_20px_50px_rgba(_179,_54,_144,_1)] overflow-hidden`}
            >
              <Image
                width={260}
                height={0}
                alt="Space-mode"
                src="/game/space-map-select.webp"
                className={`h-full w-full transition-transform ${
                  selectedMap === "space-mode" ? "scale-110" : ""
                } hover:scale-110`}
              />
            </div>
            <span className="font-bold">Space</span>
          </button>
          <button
            onClick={() => {
              setmapToLocalStorage("default");
            }}
            className={`flex flex-col items-center gap-4`}
          >
            <div
              className={`${
                selectedMap === "default"
                  ? "shadow-[0_20px_50px_rgba(_134,_195,_187,_1)]"
                  : " "
              } rounded-xl max-w-[260px] hover:shadow-[0_20px_50px_rgba(_134,_195,_187,_1)] overflow-hidden`}
            >
              <Image
                width={260}
                height={0}
                alt="Ping pong"
                src="/game/default-map-select.webp"
                className={`h-full w-full transition-transform ${
                  selectedMap === "default" ? "scale-110" : ""
                } hover:scale-110`}
              />
            </div>
            <span className="font-bold">Ping pong</span>
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
