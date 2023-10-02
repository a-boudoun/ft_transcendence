import Image from "next/image";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import socket from "../socketG";

interface ChallengeDropDownProps {
  id: number;
  setIsOpen: (isOpen: boolean) => void;
}

const ChallengeDropDown = ({ id, setIsOpen }: ChallengeDropDownProps) => {
  const { divref } = useCloseOutSide({ setIsOpen });

  return (
    <div
      ref={divref}
      className="absolute top-12 right-4 flex flex-col gap-4 rounded-2xl  bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg p-4"
    >
      <h3 className="text-blue"> challenge game of: </h3>
      <div className="flex flex-col gap-2">
        <button
          className="w-[200px] flex gap-4 items-center bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl p-2 hover:opacity-50"
          onClick={() => {
            socket.emit("invite-freind", { id: id, game: "football" });
          }}
        >
          <div className="rounded-full h-[38px] w-[38px] overflow-hidden">
            <Image
              className="h-full w-full object-cover object-center"
              src="/game/football-map-select.svg"
              width={1000}
              height={1000}
              alt="football"
            />
          </div>
          <span>football</span>
        </button>
        <button
          className="w-[200px] flex gap-4 items-center bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl p-2 hover:opacity-50"
          onClick={() => {
            socket.emit("invite-freind", { id: id, game: "space"});
          }}
        >
          <div className="rounded-full h-[38px] w-[38px] overflow-hidden">
            <Image
              className="h-full w-full object-cover object-center"
              src="/game/space-map-select.svg"
              width={1000}
              height={1000}
              alt="space"
            />
          </div>
          <span>space</span>
        </button>
        <button
          className="w-[200px] flex gap-4 items-center bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl p-2 hover:opacity-50"
          onClick={() => {
            socket.emit("invite-freind", { id: id, game: "ping pong" });
          }}
        >
          <div className="rounded-full h-[38px] w-[38px] overflow-hidden">
            <Image
              className="h-full w-full object-cover object-center"
              src="/game/default-map-select.svg"
              width={1000}
              height={1000}
              alt="ping pong"
            />
          </div>
          <span>ping pong</span>
        </button>
      </div>
    </div>
  );
};

export default ChallengeDropDown;