"use client";

import React from "react";
import Image from "next/image";
import FriendRequest from "./FriendRequest";
import MenuDropDown from "./MenuDropDown";
import AccountDropDown from "./AccountDropDown";
import GlobalSearch from "./GlobalSearch";
import { BarChart2, Gamepad2, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "@/apis/axios";

const Left = () => {
  return (
    <div className="ml-[1rem] flex items-center">
      <Image className="w-[128px]" priority  src="/img/website_logo.svg" alt="logo" width={0} height={0} />
      <div className="hidden md:block w-72">
        <GlobalSearch />
      </div>
    </div>
  );
};

const Mid = () => {
  const currentRoute = usePathname();
  const navigationRoutes: string[] = ["/leaderboard", "/game", "/chat"];

  return (
    <div className="hidden md:basis-1/3 md:flex md:justify-between">
      <Link aria-label="leaderboard" href={navigationRoutes[0]}>
        <div
          className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50 ${
            currentRoute === navigationRoutes[0] ? "opacity-50" : ""
          }`}
        >
          <BarChart2 size={32} color="#7ac7c4" strokeWidth={3} />
        </div>
      </Link>
      <Link aria-label="game" href={navigationRoutes[1]}>
        <div
          className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50 ${
            currentRoute === navigationRoutes[1] ? "opacity-50" : ""
          }`}
        >
          <Gamepad2 size={32} color="#7ac7c4" strokeWidth={1.5} />
        </div>
      </Link>
      <Link aria-label="chat" href={navigationRoutes[2]}>
        <div
          className={`grid place-content-center h-[55px] w-[56px] hover:opacity-50 ${
            currentRoute === navigationRoutes[2] ? "opacity-50" : ""
          }`}
        >
          <MessagesSquare size={32} color="#7ac7c4" strokeWidth={1.5} />
        </div>
      </Link>
    </div>
  );
};

const Right = () => {
  const {data, isLoading} = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await axios.get("/users/getUser/me");
      return data;
    },
  });

  return (
    <div className="flex">
      <FriendRequest />
      <AccountDropDown isLoading={isLoading} src={data?.image} />
      <MenuDropDown src={data?.image} />
    </div>
  );
};

const NavBar = () => {
  return (
    <nav className="fixed flex justify-between items-center h-[56px] w-screen border-b border-blue z-30">
      <Left />
      <Mid />
      <Right />
    </nav>
  );
};

export default NavBar;
