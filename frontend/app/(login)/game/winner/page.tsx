import React from 'react';
import Image from "next/image";

export default function Won(){
  return (
    <div className='bg-red'>
      <h1>You Won!</h1>
	  <Image width={100} height={100} alt="#" src="/game/m3a-m3a.svg" className="h-full w-full"/>
	  {/* https://tenor.com/view/lord-gif-21099221 */}
    </div>
  );
};