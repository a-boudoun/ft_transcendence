import { Award } from "lucide-react";

const DisplyAchievements = ({ wins }: { wins: number }) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-auto scrollbar">
      <div className="flex gap-2 justify-start p-4 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl">
        <Award size={48} />
        <div className="flex flex-col items-start">
          <h3 className="text-2xl truncate ... ">YOU ARE HERE </h3>
          <p className="text-[12px] text-blue truncate ...">you login for the first time</p>
        </div>
      </div>
      {wins > 0 && (
        <div className="flex gap-2 justify-start items-center p-4 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg rounded-2xl">
          <Award size={48} />
          <div className="flex flex-col items-start">
            <h3 className="text-2xl truncate ...">DASR</h3>
            <p className="text-[12px] text-blue truncate ..."> you win your first game</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Achievements = ({ wins }: { wins: number }) => {
  return (
    <div className="flex-[0.5] flex flex-col  xl:rounded-3xl xl:shadow-2xl xl:bg-white xl:bg-opacity-20 xl:ackdrop-blur-lg xl:drop-shadow-lg overflow-hidden">
      <div className="hidden xl:block rounded-t-3xl p-4 ">
        <div
          className={`h-[56px] w-fit flex justify-center items-center m-auto p-2 border-b border-blue`}
        >
          <Award size={28} color="#7ac7c4" strokeWidth={2} />
          <h2 className="hidden lg:inline text-[28px] ml-4">Achievements</h2>
        </div>
      </div>
      <DisplyAchievements wins={wins} />
    </div>
  );
};

export default Achievements;