"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Maps(){
	const router = useRouter();
	return (
		<div className="h-screen w-full bg-dark-gray mt-[56px] py-4 pt-[200px]">
			<div className="w-full px-2">
				<div 
					className="bg-[#4B5468] m-auto mb-[70px] w-[300px]  py-4 rounded-[10px] text-[#B5B3BD] font-medium text-center"
				>
					selet the map
				</div>
				
				<div className="flex justify-center gap-8 items-center flex-col sm:flex-row w-full">

					<div className="w-full max-w-[320px] hover:border-2 hover:border-[#B5B3BD] hover:rounded-[10px]">
						<Image width={100} height={100} alt="#" src="/game/m3a-m3a.svg" className="h-full w-full"/>
						<p className="text-white text-center mt-[10px] font-bold">m3a-m3a</p>
					</div>
					<div className="w-full max-w-[320px] hover:border-2 hover:border-[#B5B3BD] hover:rounded-[10px]">
						<Image width={100} height={100} alt="#" src="/game/ched-ched.svg" className="h-full w-full"/>
						<p className="text-white text-center mt-[10px] font-bold">ched-ched</p>
					</div>
					<div className="w-full max-w-[320px] hover:border-2 hover:border-[#B5B3BD] hover:rounded-[10px]">
						<Image width={100} height={100} alt="#" src="/game/default-map.svg" className="h-full w-full"/>
						<p className="text-white text-center mt-[10px] font-bold border">default</p>
					</div>

				</div>

			</div>
				<button
					className=" mt-6 w-full max-w-[320px] sm:max-w-auto sm:fixed bottom-[40px] right-[40px] text-white text-[20px] bg-red w-[150px] py-2 rounded-[10px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/table')}}
				>
					play
				</button>

		</div>
	)
}