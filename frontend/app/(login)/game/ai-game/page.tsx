'use client';

import { useState } from "react";
import Image from "next/image";
import  RobotGame  from "@/components/game/robotGame";


const Difficulty = () => {
	console.log("difficulty");
	const [difficulty, setDifficulty] = useState<number>(12);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	
	const handleSliderChange = (event : any) => {
	  const value = event.target.value;
	
	  switch (parseInt(value)) {
		case 1:
		  setDifficulty(14);
		  break;
		case 2:
		  setDifficulty(12);
		  break;
		case 3:
		  setDifficulty(10);
		  break;
	  }
	};
  return (
	<>
    {!gameStarted && <div className="flex w-full h-full  justify-center">
		<div className="flex items-center justify-center flex-col gap-8">
			<Image
			className="w-[400px] h-[400px]" 
			src={difficulty === 14 ? "/game/calculator.webp" : difficulty === 12 ? "/game/computer.webp" : "/game/robot.webp"} 
			width={400} 
			height={400} 
			alt="robot" />
			<input
			type="range"
			min="1"
			max="3"
			step="1"
			value={difficulty === 14 ? 1 : difficulty === 12 ? 2 : 3}
			className="w-[400px]"
			onChange={handleSliderChange}
			/>
			<button className="bg-red w-[100px] h-[30px] rounded-lg " onClick={()=>setGameStarted(true)}>Start</button>
		</div>
    </div>}
	{gameStarted && <RobotGame difficulty={difficulty}/>}
	</>
  );
};

export default Difficulty;

