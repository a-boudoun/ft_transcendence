'use client';

import Image from 'next/image'
import socket from '@/components/socketG';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";


export default function Test(){
	const[username, setUsername] = useState<string>('');
	return(
		<div className='flex bg-dark-gray items-center gap-8 justify-center w-full h-full'>
			<p className='flex p-4'>enter the player name</p>
			<input className='text-black' type="text" onChange={(e) => setUsername(e.target.value)} />
			<button className='bg-blue rounded-xl w-20 h-10'
			onClick={() => {
				socket.emit('invite-freind', username);
			}}>send</button>
		</div>
		)
}