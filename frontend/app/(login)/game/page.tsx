"use client";
import { useRouter } from "next/navigation";  

export default function Gamehome(){
	const router = useRouter();
	return (
		<main className="h-full grid place-content-center">
			<div className="h-[500px] w-[500px] flex flex-col items-center justify-center gap-20 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-3xl "> 
  				<button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/maps')}}>
   				 online game
  				</button>
  				<button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]" onClick={() => {router.push('http://localhost:3000/game/ai-game')}}>
   				 offline game
  				</button>
			</div>
		</main>
	)
}
