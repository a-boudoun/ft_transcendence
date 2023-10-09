"use client";
import { useEffect, useState, ReactNode } from "react";
import { BarChart3, Award, History, User2 } from "lucide-react";

interface UserDetailsProps {
  Stats: ReactNode;
  Archievement: ReactNode;
  Matches: ReactNode;
  Friends: ReactNode;
}

const UserDetails = (props: UserDetailsProps) => {
  const [stats, setStats] = useState<boolean>(true);
  const [achievements, setAchievements] = useState<boolean>(false);
  const [matches, setMatches] = useState<boolean>(false);
  const [friends, setFriends] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1020) {
        setFriends(false);
      }
      if (window.innerWidth > 1280) {
        setStats(true);
        setAchievements(false);
        setMatches(false);
        setFriends(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex-[0.5] grow flex flex-col sm:rounded-3xl sm:shadow-2xl bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg overflow-hidden">
      <div className="flex justify-around xl:p-4 sm:rounded-t-3xl">
        <button
          aria-label="stats"
          onClick={() => {
            setStats(true);
            setAchievements(false);
            setMatches(false);
            setFriends(false);
          }}
        >
          <div
            className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 hover:opacity-70  hover:border-b border-blue  ${
              stats ? "border-b" : ""
            }`}
          >
            <BarChart3 size={28} color="#7ac7c4" strokeWidth={2} />
            <h2 className="hidden lg:inline text-[28px] ml-4">Stats</h2>
          </div>
        </button>
        <button
          aria-label="achievements"
          className="xl:hidden"
          onClick={() => {
            setStats(false);
            setAchievements(true);
            setMatches(false);
            setFriends(false);
          }}
        >
          <div
            className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 hover:opacity-70  hover:border-b border-blue  ${
              achievements ? "border-b" : ""
            }`}
          >
            <Award size={28} color="#7ac7c4" strokeWidth={2} />
            <h2 className="hidden lg:inline text-[28px] ml-4">Achievements</h2>
          </div>
        </button>
        <button
          aria-label="matches"
          className="xl:hidden"
          onClick={() => {
            setStats(false);
            setAchievements(false);
            setMatches(true);
            setFriends(false);
          }}
        >
          <div
            className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 hover:opacity-70  hover:border-b border-blue  ${
              matches ? "border-b" : ""
            }`}
          >
            <History size={28} color="#7ac7c4" strokeWidth={2} />
            <h2 className="hidden lg:inline text-[28px] ml-4">Matches</h2>
          </div>
        </button>
        <button
          aria-label="friends"
          className="lg:hidden"
          onClick={() => {
            setStats(false);
            setAchievements(false);
            setMatches(false);
            setFriends(true);
          }}
        >
          <div
            className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 hover:opacity-70  hover:border-b border-blue  ${
              friends ? "border-b" : ""
            }`}
          >
            <User2 size={28} color="#7ac7c4" strokeWidth={2} />
            <h2 className="hidden lg:inline text-[28px] ml-4">Friends</h2>
          </div>
        </button>
      </div>
      <div className="h-full p-4 overflow-auto scrollbar sm:rounded-b-3xl">
        {stats && props.Stats}
        {achievements && props.Archievement}
        {matches && props.Matches}
        {friends && props.Friends}
      </div>
    </div>
  );
};

export default UserDetails;
