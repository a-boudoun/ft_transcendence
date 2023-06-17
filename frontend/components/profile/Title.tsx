import Image from 'next/image'

const Title = ({str, src}: { str: string , src: string}) => {
    return (
        <div className='flex justify-center border-b border-blue w-[auto]'> 
             <Image src={src} alt={str} width={28} height={28} />
             <h1 className='text-[28px] text-red ml-[28px]'>{str}</h1>
        </div>
    )
}

export default Title