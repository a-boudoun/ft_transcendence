import Title from "./Title";

const Achievements = () => {
  return (
    <div className="flex flex-col grow rounded-3xl shadow-2xl xl:bg-white xl:bg-opacity-20 xl:ackdrop-blur-lg xl:drop-shadow-lg">
      <div className="hidden xl:block rounded-t-3xl p-4 ">
        <Title
          isActive={true}
          str="Achievements"
          src="/icons/profile/Achievements.svg"
        />
      </div>
      <div className="grow grid place-content-center  xl:rounded-b-3xl">
        achievements
      </div>
    </div>
  );
};

export default Achievements;
