"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Gamehome(){
	const router = useRouter();
	return (
		<div className="h-screen p-[56px] items-center bg-dark-gray">
			<div className="w-4/5 h-4/5 flex flex-col items-center  space-y-20 bg-[red]"> 
  				<button className="text-white text-[40px] bg-red w-[400px] h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/table')}}>
   				 online game
  				</button>
  				<button className="text-white text-[40px] bg-red w-[400px] h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/table')}}>
   				 offline game
  				</button>
  				<button className="text-white text-[40px] bg-red w-[400px] h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/table')}}>
   				 play with AI
  				</button>
			</div>
		</div>
	)
}