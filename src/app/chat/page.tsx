"use client";
import React, { useState,  useEffect, useRef } from 'react';
import Image from 'next/image';
import Left from '../../comp/Left';
// import user from '../images/user.png';
// import play from '../images/play.png';
// import block from '../images/block.png';


// async function getData() {
//   const res = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=150');

//   if (!res.ok) {

//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }

interface Message {
  id: number;
  content: string;
}

export default  function Chat() {

  const [inputValue, setInputValue] = React.useState<string>("");
  const [message, setMessage] = React.useState<Message[]>([]);
  const scrollContainerRef = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (inputValue.length > 0) {
      const newMessage: Message = {
        id: Date.now(),
        content: inputValue
      };
      setMessage([...message, newMessage]);
      setInputValue("");
    }
  }
  useEffect(() => {
    // Automatically scroll to the bottom of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [message]);


  // const data = await getData();
  return (
    <div>


      <Nav />
      <div className="flex justify-center  items-center bg-[#384259] mx-0 md:mx-14 mt-2 ">
        {/* left */}

        {/* <div className="w-1/5 lg:w-2/5 lg:p-2 max-w-[400px]">
          {/* <Mininav /> */}
          <div className="h-[91.5vh] bg-[#384259]rounded-xl"> 
              <Left />
          {/* </div> */}
        </div>

        {/* center */}
        <div className=" w-4/5 lg:w-3/5 p-1 lg:p-2 max-w-[600px] ">
          <div className="h-[91.5vh] bg-[#5B6375] flex flex-col justify-between rounded-xl">
            <div className='p-3 overflow-y-scroll whitespace-pre-wrap' ref={scrollContainerRef}>
              {message.map((message: Message) => (
                <div className='h-fit text-white bg-gray-500 px-3 max-w-sm whitespace-pre-wrap rounded-md mb-1 w-fit' key={message.id}>{message.content}</div>
              ))}
            </div>
            <div>

              <input className='border-2 bg-gray-500 w-4/5 mb-2 ml-2  mr-2' type="text" value={inputValue} onChange={handleChange} />
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="w-2/5 p-2 hidden lg:block max-w-[375px]">
          <div className="h-[91.5vh] bg-[#5B6375]  rounded-xl"></div>
        </div>

      </div>
    </div>
  )

}

export function Nav() {
  return (
    <div className="h-[56px] w-full border-b border-[#7AC7C4]">

    </div>
  )
}


export function Mininav() {
  return (
    <div className='flex justify-between  p-4  px-[5%] md:px-[20%] border-b-2 border-[#7AC7C4] bg-[#5B6375]'>
      <Image
        className='inline'
        alt='Picture of the author'
        src="/images/md.png"
        width={36}
        height={40}
      />
      <Image
        className='inline'
        src="/images/mc.png"
        width={43}
        alt='Picture of the author'
        height={40}
      />
    </div>
  );
}

export function Message({ data: data }: { data: any }) {
  return (
    <div className="flex  justify-between	 items-center space-x-2	my-[1px]	 bg-[#5B6375] hover:bg-[#384259]  px-1 lg:px-4  py-2">

      <div className='flex items-center'>
        <Image
          priority
          className='rounded-full'
          src={data.url}
          alt="Picture of the author"
          width={55}
          height={55}
        />
        <div className=' max-h-[20px] ml-4 max-w-[80px] xl:max-w-[150px] overflow-hidden hidden lg:block'>{data.title}</div>
      </div>
      <div className='justify-end space-x-2 hidden sm:block'>
        <Image
          className='inline'
          src="/images/block.png"
          alt="Picture of the author"
          width={15}
          height={15}
        />
        <Image
          className='inline'
          src="/images/play.png"
          alt="Picture of the author"
          width={15}
          height={15}
        />

      </div>
    </div>
  )
};


export function Fcc() {
  return (
    <div className='flex flex-row space-x-2  h-[45px]'>
      <div className='flex bg-[#384259] w-10/12 h-[30px]  mb-3 ml-3 rounded-md ' >
        <input className='bg-[#384259] ml-1 w-full h-full rounded-md outline-none  text-sm' placeholder='Type your message here...' />
      </div>
      <Image
        className='inline w-1/6 h-[30px]'
        src="/images/send.svg"
        alt="Picture of the author"
        width={91}
        height={36}
      />
    </div>
  );
}