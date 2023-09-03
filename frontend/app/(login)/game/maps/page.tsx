"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Maps(){
	const router = useRouter();
	const [selectedMap, setSelectedMap] = useState<string>("default");


	const setmapToLocalStorage = (map: string) => {
		setSelectedMap(map);
		localStorage.setItem("map", map);
	}


	useEffect(() => {
		const map: string | null = localStorage.getItem("map");

		if (map) {
			setSelectedMap(map);
		}
	}, [selectedMap]);

	return (
		<main className="h-full w-full bg-dark-gray  pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
			<div className="flex flex-col items-center gap-8 pt-8 sm:gap-16 sm:pt-32">
				<div className="bg-[#4B5468]  rounded-[10px] w-[300px] py-4">
					<h3 className="text-[#B5B3BD] tracking-wide [word-spacing:3px] font-medium text-3xl"> selet the map </h3>
				</div>
				<div className="flex justify-center gap-8 items-center flex-col sm:flex-row w-full">

						<div
							className={selectedMap === "m3a-m3a" ? "w-full max-w-[320px] border-b-[5px] border-b-[#2DFCEE] rounded-b-[8px]"
							:"w-full max-w-[320px] hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px]"}
							onClick={() => setmapToLocalStorage("m3a-m3a")}>
							<Image width={100} height={100} alt="#" src="/game/m3a-m3a.svg" className="h-full w-full"/>
							<p className="text-white text-center mt-[10px] font-bold">m3a-m3a</p>
						</div>
						<div 
							className={selectedMap === "ched-ched" ? "w-full max-w-[320px] border-b-[5px] border-b-[#2DFCEE] rounded-b-[8px]"
							:"w-full max-w-[320px] hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px]"}
							onClick={() => setmapToLocalStorage("ched-ched")}>
							<Image width={100} height={100} alt="#" src="/game/ched-ched.svg" className="h-full w-full"/>
							<p className="text-white text-center mt-[10px] font-bold">ched-ched</p>
						</div>
						<div 
							className={selectedMap === "default" ? "w-full max-w-[320px] border-b-[5px] border-b-[#2DFCEE] rounded-b-[8px]"
							:"w-full max-w-[320px] hover:border-b-[5px] hover:border-b-[#2DFCEE] hover:rounded-b-[8px]"}
							onClick={() => setmapToLocalStorage("default")}>
							<Image width={100} height={100} alt="#" src="/game/default.svg" className="h-full w-full"/>
							<p className="text-white text-center mt-[10px] font-bold">default</p>
						</div>
				</div>
					<button
						className=" w-full max-w-[320px] sm:max-w-auto  bottom-[40px] right-[40px] text-white text-[30px] bg-red w-[150px] py-2 rounded-[10px] hover:bg-[#FBACB3] font-bold" onClick={() => {router.push('http://localhost:3000/game/match')}}
						>
						Next
					</button>
			</div>
		</main>
	)
}