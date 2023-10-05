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
        <main className="min-h-screen  grid place-content-center pt-14 bg-bg bg-cover">
          <div className="flex flex-wrap flex-col items-center gap-8  sm:p-16 sm:gap-24  sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
            <div className="bg-[#4b5468a0] rounded-[10px] p-4 ">
              <h3 className="text-[#B5B3BD] tracking-wide [word-spacing:3px] font-medium text-xl sm:text-3xl">
                select the difficulty
              </h3>
            </div>
            <div className="flex justify-center gap-8 items-center flex-col sm:flex-row">
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => setDifficulty(14)}
              >
                <div className={`rounded-xl max-w-[260px] overflow-hidden`}>
                  <Image
                    width={260}
                    height={0}
                    alt="football-mode"
                    src="/game/robot.svg"
                    className={`w-260 object-cover object-center transition-transform ${
                      difficulty === 14 ? "scale-110" : ""
                    } hover:scale-110`}
                  />
                </div>
                <span className="text-xl font-bold">Easy</span>
              </button>
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => setDifficulty(12)}
              >
                <div className={`rounded-xl max-w-[260px] overflow-hidden`}>
                  <Image
                    width={260}
                    height={0}
                    alt="Space-mode"
                    src="/game/robot.svg"
                    className={`w-260 object-cover object-center transition-transform ${
                      difficulty === 12 ? "scale-110" : ""
                    } hover:scale-110`}
                  />
                </div>
                <span className="text-xl font-bold">medium</span>
              </button>
              <button
                className={`flex flex-col items-center gap-4`}
                onClick={() => setDifficulty(10)}
              >
                <div className={`rounded-xl max-w-[260px] overflow-hidden`}>
                  <Image
                    width={260}
                    height={0}
                    alt="Ping pong"
                    src="/game/robot.svg"
                    className={`w-260 transition-transform ${
                      difficulty === 10 ? "scale-110" : ""
                    } hover:scale-110`}
                  />
                </div>
                <span className="text-xl font-bold">Hard</span>
              </button>
            </div>
            <button
              className="flex gap-2 items-center text-3xl bg-red py-2 px-8 rounded-[10px] hover:bg-[#FBACB3] font-bold"
              onClick={() => setGameStarted(true)}
            >
              <span>Play</span>
              <Gamepad2 size={32} strokeWidth={2}  />
            </button>
          </div>
        </main>
      )}
    </>
  );
};

export default Difficulty;
