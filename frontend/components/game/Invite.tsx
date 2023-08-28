import Image from 'next/image'


const Invite = () => {
	return (
		<div className={`flex justify-between bg-dark-gray px-4 py-2 rounded-xl gap-2 sm:gap-8`}>
			<div className="flex items-center gap-4">
				<Image  className=" sm:w-[48px] sm:h-[48px] rounded-full self-center"  src='/game/man.png' width={36}  height={36} alt="user image"/>
				<div className="text-left">
				  <h3 className="text-[12px] sm:text-[24px]" >Player</h3> 
				  <p className="text-[6px] sm:text-[8px] ">sent you a friend request</p>
				</div>
			</div>
			<div className="flex items-center gap-2 text-[12px] sm:gap-4 sm:text[24px]">
				<button className="bg-red rounded-xl px-2 py-1 sm:px-4 sm:py-2">Decline</button>
				<button className="bg-blue rounded-xl px-2 py-1 sm:px-4 sm:py-2">Accept</button>
			</div>
	  </div>
	);
}

export default Invite