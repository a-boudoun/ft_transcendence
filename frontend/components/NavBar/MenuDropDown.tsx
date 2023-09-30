"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Search,
  Menu,
  XCircle,
  BarChart2,
  Gamepad2,
  MessagesSquare,
  Settings,
} from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import Link from "next/link";
import Logout from "./Logout";

interface Props {
  src: string;
  setIsOpen: (isOpen: boolean) => void;
}

const SearchBarDropDown = () => {
  return (
    <div className="h-14 w-56 absolute right-14 top-14 flex flex-col justify-center px-2 rounded-l-xl md:hidden bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg">
      <GlobalSearch />
    </div>
  );
};

const DropDown = ({ src, setIsOpen }: Props) => {
  const { divref } = useCloseOutSide({ setIsOpen });
  const [isShearch, setIsSearch] = useState<boolean>(false);
  const navigationRoutes: string[] = ["/leaderboard", "/game", "/chat"];

  return (
    <div ref={divref}>
      <div className="flex flex-col justify-around absolute top-14 right-0 w-14 md:hidden bg-black bg-opacity-50 ackdrop-blur-lg drop-shadow-lg">
        <button
          aria-label="search"
          className="flex justify-center items-center h-[56px] w-[56px] hover:opacity-50"
          onClick={() => setIsSearch(!isShearch)}
        >
          <Search size={28} color="#7ac7c4" strokeWidth={1.5} />
        </button>
        <Link href={navigationRoutes[0]}>
          <div
            className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50`}
          >
            <BarChart2 size={32} color="#7ac7c4" strokeWidth={3} />
          </div>
        </Link>
        <Link href={navigationRoutes[1]}>
          <div
            className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50`}
          >
            <Gamepad2 size={32} color="#7ac7c4" strokeWidth={1.5} />
          </div>
        </Link>
        <Link href={navigationRoutes[2]}>
          <div
            className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50`}
          >
            <MessagesSquare size={32} color="#7ac7c4" strokeWidth={1.5} />
          </div>
        </Link>
        <Link href={"/profile"}>
          <div
            className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50`}
          >
            <Image
              className="rounded-full h-[28px] w-[28px]"
              src={src}
              alt={"profile"}
              width={28}
              height={28}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </Link>
        <Link href={"/settings"}>
          <div
            className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50`}
          >
            <Settings size={28} color="#7ac7c4" strokeWidth={1.5} />
          </div>
        </Link>
        <Logout />
      </div>
      {isShearch && <SearchBarDropDown />}
    </div>
  );
};

const MenuDropDown = ({ src }: { src: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative grid md:hidden place-content-center h-[55px] w-[56px] hover:opacity-50">
        <button 
          aria-label="menu"
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XCircle size={28} color="#EA5581" strokeWidth={1.5} />
          ) : (
            <Menu size={32} color="#7ac7c4" strokeWidth={1.5} />
          )}
        </button>
      </div>
      {isOpen && <DropDown src={src} setIsOpen={setIsOpen} />}
    </>
  );
};

export default MenuDropDown;
