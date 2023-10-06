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

  return (
    <main className="min-h-screen  grid place-content-center pt-14">
      {Winner === "" && Loser === "" && (
        <>
          {PVisible && !leftScore && !rightScore && (
            <p className="absolute font-bold text-[#f6f6f6] z-10 text-[90px] mb-[150px] ">
              {countDownValue}
            </p>
          )}

          <div className="flex flex-col gap-8 p-16 sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl">
            {LeftPlayer !== "" && RightPlayer !== "" && (
              <PlayersScore
                left={leftScore}
                right={rightScore}
                leftPlayer={LeftPlayer}
                rightPlayer={RightPlayer}
              />
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
