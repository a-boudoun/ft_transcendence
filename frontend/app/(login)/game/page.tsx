import Link from "next/link";

export default function Gamehome() {
	console.log("gamehome");
  return (
    <main className="h-full grid place-content-center">
      <div className="h-[500px] w-[500px] flex flex-col items-center justify-center gap-20 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-3xl ">
        <Link href="/game/maps">
          <button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]">
            online game
          </button>
        </Link>
        <Link href="/game/ai-game">
          <button className="text-white font-bold text-[35px] bg-red w-1/2 h-[90px] rounded-[20px] hover:bg-[#FBACB3]">
            offline game
          </button>
        </Link>
      </div>
    </main>
  );
}
