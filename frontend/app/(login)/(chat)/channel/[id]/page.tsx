"use client";
import React from 'react'
import Image from 'next/image'
import Messeges from '@/components/chat/Messeges';
import Link from 'next/link';
import Mid from '@/components/chat/Mid';
import { usePathname } from 'next/navigation';

const Page = () => {
    return (
        <>
            <Mid />
            <div className={`hidden lg:flex lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl`}>
            </div>
        </>
    );
}

export default Page;