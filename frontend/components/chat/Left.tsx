"use client";
import Chat from './Chat';
import { useParams } from 'next/navigation'
const Left = () => {

    return (
        <div className={`h-full w-full ${useParams().id ? 'hidden': ''} md:block md:w-1/2  lg:w-4/12  sm:mx-6  sm:rounded-[2.5rem] bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg sm:p-4  min-w-[300px]`}>
            <Chat />
        </div>
    );
}

export default Left;


