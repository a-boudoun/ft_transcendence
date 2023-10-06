"use client";

import React, { useEffect, useState } from "react";
import PlayersScore from "@/components/game/score";
import Won from "@/components/game/winner";
import Lost from "@/components/game/loser";
import { useRouter } from "next/navigation";
import socket from "@/components/socketG";
import DefaultGame from "./defaultGame";
import FootGame from "./footGame";
import DisapGame from "./disapearGame";

interface Prop {
  meId: string;
}

export default function Game({ meId }: Prop) {
  const [PVisible, setPVisible] = useState<boolean>(true);
  const router = useRouter();
  const [countDownValue, setCountDownValue] = useState<number>(3);
  const [leftScore, setLeftScore] = useState<number>(0);
  const [rightScore, setRightScore] = useState<number>(0);
  const [LeftPlayer, setLeftPlayer] = useState<string>("");
  const [RightPlayer, setRightPlayer] = useState<string>("");
  const [roomid, setRoomid] = useState<string>("");
  const [Winner, setWinner] = useState<string>("");
  const [Loser, setLoser] = useState<string>("");
  const [map, setMap] = useState<string>("default");
  const [sx, setSx] = useState<number>(1);
	const [sy, setSy] = useState<number>(1);

  useEffect(() => {
    let selected: string | null = localStorage.getItem("map");
    if (selected !== null) {
      setMap(selected);
    }

    socket.emit("full-Game", meId);
    socket.on("game-info", (data: any) => {
      setLeftPlayer(data.leftPlayer);
      setRightPlayer(data.rightPlayer);
      setRoomid(data.room);
      selected = localStorage.getItem("map");
      if (selected !== null) {
        setMap(selected);
      }
    });
    return () => {
      socket.off("game-info");
    };
  }, []);

  useEffect(() => {
    socket.on("score", (data) => {
      setLeftScore(data.leftScore);
      setRightScore(data.rightScore);
    });
    socket.on("winner", (data) => {
      if (meId.toString() === RightPlayer) {
        if (data === "right") setWinner(RightPlayer);
        else setLoser(RightPlayer);
      } else {
        if (data === "left") setWinner(LeftPlayer);
        else setLoser(LeftPlayer);
      }
    });
    return () => {
      socket.off("score");
      socket.off("winner");
    };
  }, [rightScore, leftScore, LeftPlayer, RightPlayer]);

  useEffect(() => {
    if (countDownValue == 0) {
      setPVisible(false);
    } else {
      setTimeout(() => setCountDownValue(countDownValue - 1), 1000);
    }
  }, [countDownValue]);

  useEffect(() => {
    let canvasWidth: number = 1750;
    let canvasHeight: number = 1200;
    
    let windowWidth: number = window.innerWidth;
    let windowHeight: number = window.innerHeight;
    
    let scaleFactor: number = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
    
    let scalex: number = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
    let scaley: number = scaleFactor > 0.95 ? 1 : scaleFactor * 0.85; // adding the navbar height
    setSx(scalex);
    setSy(scaley);
    window.addEventListener("resize", handleResize);
    
    function handleResize(){
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      scaleFactor = Math.min(windowWidth / canvasWidth, windowHeight / canvasHeight);
      scalex = scaleFactor > 1 ? 1 : scaleFactor * 0.95;
      scaley = scaleFactor > 1 ? 1 : scaleFactor * 0.85; // adding the navbar height
      setSx(scalex);
      setSy(scaley);
    }
    
    return () => {
      window.removeEventListener("resize", handleResize);
    }
    }, []);

  return (
    <main className="w-full h-full grid place-content-center pt-14">
      {Winner === "" && Loser === "" && (
        <>

          <div className="flex flex-col gap-8 p-16 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl"
              style={{
                transform: `scale(${sx}, ${sy})`,
              }}
              >
            {LeftPlayer !== "" && RightPlayer !== "" && (
              <PlayersScore
              left={leftScore}
              right={rightScore}
              leftPlayer={LeftPlayer}
              rightPlayer={RightPlayer}
              />
              )}

            <div className="relative" > 
                {PVisible && !leftScore && !rightScore && (
                <p className="absolute top-[50%] left-[50%]  font-bold text-[#f6f6f6] z-10 text-[90px] mb-[150px] ">
                  {countDownValue}
                </p>
              )}

              {map === "default" && (
                <DefaultGame
                  roomid={roomid}
                  me={meId.toString()}
                  RightPlayer={RightPlayer}
                />
              )}

              {map === "football-mode" && (
                <FootGame
                  roomid={roomid}
                  me={meId.toString()}
                  RightPlayer={RightPlayer}
                />
              )}

              {map === "space-mode" && (
                <DisapGame
                  roomid={roomid}
                  me={meId.toString()}
                  RightPlayer={RightPlayer}
                />
              )}

            </div>
            <button
              className="ml-auto mt-10  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]"
              onClick={() => {
                socket.emit("leave-game", {
                  room: roomid,
                  player: meId.toString(),
                });
                router.push("/game");
              }}
            >
              leave
            </button>
          </div>
        </>
      )}
      {Winner !== "" && (
        <Won
          setLost={setLoser}
          setWon={setWinner}
          me={meId.toString()}
          other={meId.toString() == RightPlayer ? LeftPlayer : RightPlayer}
        />
      )}
      {Loser !== "" && (
        <Lost
          setLost={setLoser}
          setWon={setWinner}
          me={meId.toString()}
          other={meId.toString() == RightPlayer ? LeftPlayer : RightPlayer}
        />
      )}
    </main>
  );
}
