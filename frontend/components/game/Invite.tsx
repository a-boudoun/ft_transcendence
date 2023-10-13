'use client';

import Image from 'next/image'
import socket from '@/components/socketG';
import axios from '@/apis/axios';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface prop {
	socketId: string;
	userid: number;
	setdisplay: (val: string | null) => void;
	map: string;
}

const InviteDisplay = ({socketId, setdisplay, userid, map}: prop) => {

	const [timeLeft, setTimeLeft] = useState(4);
	const [image, setImage] = useState<string>('/game/unknown.webp');
	const [name, setName] = useState<string>('');
	let loadingBarWidth: string = '0%';
	useQuery({
		queryKey: ['left'],
		queryFn: async ()=> {
		  const {data} = await axios.get(`/users/getId/${userid}`)
		  setName(data.username);
		  setImage(data.image);
		}
	});

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
		<div className={`flex  mt-1 justify-between bg-[rgb(78,113,163)] px-4 py-2 rounded-xl gap-2 sm:gap-8`}>
				<div className="flex items-center gap-4">
					<Image  className=" sm:w-[48px] sm:h-[48px] rounded-full self-center"  src={image} width={36}  height={36} alt="user image"/>
					<div className="text-left">
					<h3 className="text-[12px] sm:text-[20px]" >{name}</h3> 
					<p className="text-[8px] sm:text-[10px] ">wants to play with you</p>
					</div>
				</div>
				<div className="flex items-center gap-2 text-[12px] sm:gap-4 sm:text[24px]">
					<button className="bg-[rgb(248,72,72)] rounded-xl px-2 py-1 sm:px-4 sm:py-2"
					onClick={() => {
						setdisplay(null);
					}}
					>Decline</button>
					<button className="bg-[rgba(86,245,65,0.75)] rounded-xl px-2 py-1 sm:px-4 sm:py-2"
					onClick={() => {
						localStorage.setItem("map", map);
						setdisplay(null);
						socket.emit('accept-invitation', {senderUsername: userid, senderSocketId: socketId});
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
	const [socketId, setSocketId] = useState<string>('');
	const [userId, setUserId] = useState<number>(0);
	const [map, setMap] = useState<string>('default');
	const router = useRouter();
	
	useEffect(() => {
		socket.on('play-a-friend', () =>{
			router.push('/game/match');
		});
		socket.on('game-invitation', (data: any) => {
			setDisplay(data.sender);
			setMap(data.map);
			setSocketId(data.senderSocketId);
			setUserId(data.sender);
		});

		return () => {
			socket.off('game-invitation');
			socket.off('play-a-friend');
		};
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (display !== null) {
			timer = setTimeout(() => {
				setDisplay(null);
			}, 4000);
		}
		return () => {
			clearTimeout(timer);
		}
	}, [display]);

	return (
    <div className='absolute right-3 bottom-10 z-10'>
	 {display !== null && <InviteDisplay 
		userid={userId} 
		socketId={socketId}
		setdisplay={setDisplay}
		map={map}
		/>}
	</div>
  );
}

export default Invite