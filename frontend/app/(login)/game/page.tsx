import Link from "next/link";

export default function Gamehome() {
  return (
    <main className="h-full grid place-content-center">
      <div className="font-bold text-2xl  flex flex-col gap-10 items-center justify-center px-10 py-20  bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-3xl  sm:gap-20 sm:text-4xl sm:p-28">
        <Link className="text-white bg-red rounded-3xl p-8 hover:bg-[#FBACB3]" href="/game/maps">
          online game
        </Link>
        <Link className="text-white bg-red rounded-3xl p-8 hover:bg-[#FBACB3]" href="/game/ai-game">
            offline game
        </Link>
      </div>
    </main>
  );
}
