"use client";
import Image from 'next/image';
import { useEffect,useRef, useState } from 'react';

export default function Left() {
  const [data, setData] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://10.11.7.8:4000/user');
        const jsonData = await res.json();

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Automatically scroll to the bottom of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    
      <div className="h-[91.5vh] bg-[#384259]  overflow-y-scroll rounded-xl" ref={scrollContainerRef}>
        {data.map((user) => (
          <Message key={user.id} data={user} />
        ))}
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
                    src="/imgs/block.png"
                    alt="Picture of the author"
                    width={15}
                    height={15}
                />
                <Image
                    className='inline'
                    src="/imgs/play.png"
                    alt="Picture of the author"
                    width={15}
                    height={15}
                />

            </div>
        </div>
    )
};

