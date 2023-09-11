"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Gamehome(){
	const router = useRouter();
	return (
		<div className="h-screen p-[56px] flex items-center justify-center  bg-dark-gray">
			<div className="h-[500px] w-[500px] flex flex-col items-center justify-center space-y-20 bg-[#384259] rounded-[30px]"> 
  				<button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/maps')}}>
   				 online game
  				</button>
  				<button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/ai-game')}}>
   				 play with AI
  				</button>
			</div>
		</div>
	)
}
