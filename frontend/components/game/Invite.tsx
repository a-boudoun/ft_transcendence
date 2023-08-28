'use client';

import Image from 'next/image'
import socket from '@/components/socketG';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { set } from 'zod';

interface prop {
	username: string;
	socketId: string;
	setdisplay: (val: string | null) => void;
}

const InviteDisplay = ({username, socketId, setdisplay}: prop) => {

	const [timeLeft, setTimeLeft] = useState(4);
	let loadingBarWidth: string = '0%';
	
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prevTime => prevTime - 0.01);
		}, 10);
		
		return () => {
			clearInterval(timer);
		};
	}, []);
	
	loadingBarWidth = `${((timeLeft) / 4) * 100}%`;
	return(
		<>
		<div className={`flex  mt-1 justify-between bg-dark-gray px-4 py-2 rounded-xl gap-2 sm:gap-8`}>
				<div className="flex items-center gap-4">
					<Image  className=" sm:w-[48px] sm:h-[48px] rounded-full self-center"  src='/game/man.png' width={36}  height={36} alt="user image"/>
					<div className="text-left">
					<h3 className="text-[12px] sm:text-[20px]" >{username}</h3> 
					<p className="text-[8px] sm:text-[10px] ">wants to play with you</p>
					</div>
				</div>
				<div className="flex items-center gap-2 text-[12px] sm:gap-4 sm:text[24px]">
					<button className="bg-red rounded-xl px-2 py-1 sm:px-4 sm:py-2"
					onClick={() => {
						setdisplay(null);
					}}
					>Decline</button>
					<button className="bg-blue rounded-xl px-2 py-1 sm:px-4 sm:py-2"
					onClick={() => {
						socket.emit('accept-invitation', {senderUsername: username, senderSocketId: socketId});
						setdisplay(null);
					}}
					>Accept</button>
				</div>
		</div>
		<div className="relative h-2 rounded">
			<div className="absolute bg-[rgb(146,230,135)] h-[5px] rounded-xl " style={{ width: loadingBarWidth }}></div>
		</div>
		</>
	);
}

const Invite = () => {
	
	const[display, setDisplay] = useState<string | null>(null);
	const [username, setUsername] = useState<string>('');
	const [socketId, setSocketId] = useState<string>('');
	const router = useRouter();
	
	useEffect(() => {
		socket.on('play-a-friend', () =>{
			router.push('http://localhost:3000/game/match');
		});
		socket.on('game-invitation', (data: any) => {
			setUsername(data.sender);
			setDisplay(data.sender);
			setSocketId(data.senderSocketId);
		});

		return () => {
			socket.off('game-invitation');
			socket.off('play-a-friend');
		};
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (username) {
			setDisplay(username);
			timer = setTimeout(() => {
				setDisplay(null);
			}, 4000);
		}
		return () => {
			clearTimeout(timer);
		}
	}, [username]);

	return (
    <div className='absolute right-3 bottom-10'>
	 {display && <InviteDisplay 
	 	username={username} 
		socketId={socketId}
		setdisplay={setDisplay}
		/>}
	</div>
  );
}

export default Invite