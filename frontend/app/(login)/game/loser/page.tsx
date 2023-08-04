import React from 'react';
import Image from "next/image";

export default function Lost(){
  return (
    <div>
	  <Image width={100} height={100} alt="#" src="/game/game-lost.svg" className="h-full w-full"/>
    </div>
  );
};