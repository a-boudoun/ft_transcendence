import React from 'react'
import Image from 'next/image'
import Messeges from '@/components/chat/ChannelItems';
import Link from 'next/link';
import Mid from '@/components/chat/Mid';
import { usePathname } from 'next/navigation';
import userDto from '@/dto/userDto';
import getData from '@/apis/getData';

const Page = async() => {
    const user = await getData('/channels/me');
    return (
        <>
            <Mid  user={user}  />
            <div className={`hidden lg:flex lg:w-3/12 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-xl`}>
            {user.name}
            </div>
        </>
    );
}

export default Page;