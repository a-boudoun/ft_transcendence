'use client';

import React from 'react';
import { useEffect, useState, useQuery } from 'react';
import socket from '@/components/socketG';
import Image from "next/image";

export default function MatchPlayers(){
	return (
		<div className = 'w-full h-full bg-dark-gray iterms-center'>
			<div className = 'iterms-center justify-between bg-red'>
				<Image src="/icons/avatar.svg" width={100} height={100} alt="avatar"/>
			</div>
		</div>
	)
}