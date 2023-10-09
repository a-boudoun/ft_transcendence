import Link from "next/link";
import Image from "next/image";

export default function Gamehome() {
  return (
    <main className="h-full grid place-content-center">
      <div className="font-bold text-2xl flex flex-wrap gap-10 items-center justify-center px-10 py-20  sm:bg-white sm:bg-opacity-20 sm:ackdrop-blur-lg sm:drop-shadow-lg sm:rounded-3xl  sm:gap-20 sm:text-4xl sm:p-28">
          <div className="relative flex flex-col gap-4">
            <Link className="" href="/game/maps">
              <div className="rounded-xl max-w-[340px] max-h-[290px] overflow-hidden hover:shadow-[10px_20px_50px_#34ced6,-10px_-5px_50px_#a015c6]">
                <Image
                  priority
                  width={340}
                  height={0}
                  alt="football-mode"
                  src="/game/online-game-select.webp"
                  className="object-cover object-center transition-transform hover:scale-110 "
                />
              </div>
            </Link>
            <span className="absolute bottom-2 left-2 "> online game </span>
          </div>
          <div className="relative flex flex-col gap-4">
            <Link className="" href="/game/ai-game">
              <div className="rounded-xl max-w-[340px] max-h-[290px] overflow-hidden hover:shadow-[10px_20px_50px_#34ced6,-10px_-5px_50px_#a015c6]">
                <Image
                  priority
                  width={340}
                  height={0}
                  alt="football-mode"
                  src="/game/offline-game-select.webp"
                  className="object-cover object-center transition-transform hover:scale-110 "
                />
              </div>
            </Link>
            <span className="absolute bottom-2 left-2 "> offline game </span>
          </div>
        </div>
    </main>
  );
}
