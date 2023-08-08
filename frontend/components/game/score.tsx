import React from "react";
import Image from "next/image";


interface score{
	left: number,
	right: number
}

function MePlayer({ left, right } : score) {

	return (
		<div className="flex items-center gap-2">
			<div className="flex flex-col items-center w-[80px] h-[80px]">
				<Image src="/game/man.png" width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
				<h1 className="text-[#F2F2F2] font-bold">Me</h1>
			</div>
			<h1>
				score: {left}
			</h1>
		</div>

	);
}

function OtherPlayer({ left, right } : score) {
	return (
		<div className="flex items-center gap-2">
			<h1>
				score: {right}
			</h1>
			<div className="flex flex-col items-center w-[80px] h-[80px]">
				<Image src="/game/man1.png" width={100} height={100} alt="#" className="w-full h-full rounded-full"/>
				<h1 className="text-[#F2F2F2] font-bold">other</h1>
			</div>
		</div>
	);
}

function PlayersScore({ left, right } : score) {
	return (
	  <div className="flex justify-between absolute top-[160px] left-[100px] right-[100px]">
		<MePlayer left={left} right={right}/>
		<OtherPlayer left={left} right={right}/>
	  </div>
	);
}

export default PlayersScore;