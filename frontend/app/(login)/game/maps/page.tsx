"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Maps(){
	const router = useRouter();
	return (
		<div className="h-screen p-[56px] flex justify-center  bg-dark-gray">
			<section className="bg-[#4B5468] w-[200px] h-[60px] flex items-center justify-center rounded-[10px] mt-[150px] text-[#B5B3BD]">selet the map</section>
			<div className="bg-red h-[300px] w-[300px] flex justify-center mt-[300px]">
				map1
				map2
				map3
			</div>
			<button className="absolute bottom-[40px] right-[40px] m-4  text-white text-[20px] bg-red w-[150px] h-[40px] rounded-[10px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/table')}}>
				play
			</button>
		</div>
	)
}