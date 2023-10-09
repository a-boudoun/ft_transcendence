"use client";

import { useState } from "react";
import Image from "next/image";
import RobotGame from "@/components/game/robotGame";
import { Gamepad2 } from "lucide-react";

const Difficulty = () => {
  const [difficulty, setDifficulty] = useState<number>(12);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  return (
    <>
      {gameStarted ? (
        <RobotGame difficulty={difficulty} />
      ) : (
        <main className="min-h-screen  grid place-content-center pt-14 bg-bg bg-cover ">
          <div className="flex flex-wrap flex-col items-center gap-8  sm:p-16 sm:gap-24  sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
            <div className="bg-[#4b5468a0] rounded-[10px] p-4 ">
              <h3 className="text-[#B5B3BD] tracking-wide [word-spacing:3px] font-medium text-xl sm:text-3xl">
                select the difficulty
              </h3>
            </div>
            <div className="flex justify-center gap-8 items-center flex-col sm:flex-row">
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => {
                  setDifficulty(14)
                  setGameStarted(true)}
                }
              >
                  <Image
                    width={260}
                    height={260}
                    alt="football-mode"
                    src="/game/easy-robot.webp"
                    className={`w-[260px] h-[260px] transform hover:scale-110`}
                  />
                <span className="text-xl font-bold">Easy</span>
              </button>
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => {
                  setDifficulty(12)
                  setGameStarted(true)}
                }
              >
                  <Image
                    width={260}
                    height={260}
                    alt="Space-mode"
                    src="/game/medium-robot.webp"
                    className={`w-[260px] h-[260px] transition-transform hover:scale-110`}
                  />
                <span className="text-xl font-bold">medium</span>
              </button>
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => {
                  setDifficulty(10)
                  setGameStarted(true)}
                }
              >
                  <Image
                    width={260}
                    height={260}
                    alt="Ping pong"
                    src="/game/hard-robot.webp"
                    className={`w-[260px] h-[260px] transition-transform hover:scale-110`}
                  />
                <span className="text-xl font-bold">Hard</span>
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Difficulty;
