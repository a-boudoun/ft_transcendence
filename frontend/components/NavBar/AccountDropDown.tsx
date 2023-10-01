"user client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import useCloseOutSide from "@/hookes/useCloseOutSide";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { UserCircle2, XCircle, Settings } from "lucide-react";
import Link from "next/link";
import Logout from "./Logout";

interface Props {
  src: string;
  setIsOpen: (isOpen: boolean) => void;
}

const DropDown = ({ src, setIsOpen }: Props) => {
  const { divref } = useCloseOutSide({ setIsOpen });

  return (
    <div
      ref={divref}
      className="hidden md:flex flex-col justify-around  absolute top-[56px] right-0 w-[56px] h-[160px] bg-black  bg-opacity-50 ackdrop-blur-lg drop-shadow-lg"
    >
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
  );
};

const AccountDropDown = ({isLoading, src} : {isLoading : boolean, src : string}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {isLoading ? (
        <div className="hidden md:grid place-content-center mr-[14px]">
          <UserCircle2 size={28} color="#7ac7c4" strokeWidth={1.5} />
        </div>
      ) : (
        <button
          className="hidden md:grid place-content-center mr-[14px] overflow-hidden hover:opacity-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XCircle size={28} color="#EA5581" strokeWidth={1.5} />
          ) : (
            <Image
              className="rounded-full h-[28px] w-[28px]"
              src={src}
              alt={"user image"}
              width={28}
              height={28}
            />
          )}
        </button>
      )}
      {isOpen && <DropDown src={src} setIsOpen={setIsOpen} />}
    </>
  );
};

export default AccountDropDown;
