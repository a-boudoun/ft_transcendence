import React from "react";

const Title = () => {
  return (
    <div className="h-[60px] w-[260px] m-auto rounded-[2.5rem] shadow-2xl bg-gray-300 animate-pulse"></div>
  );
};

const Card = () => {
  return (
    <div className="h-[50%] shadow-2xl p-4 rounded-[2.5rem] bg-gray-400 animate-pulse">
      <Title />
    </div>
  );
};

const User = () => {
  return (
    <div className="relative h-[50%] rounded-[2.5rem] shadow-2xl bg-gray-400 overflow-hidden animate-pulse ">
      <div className="absolute w-full flex gap-4 items-center p-8 bottom-0 bg-black/50">
        <div className="rounded-full w-[86px] h-[86px] bg-gray-300 "></div>
        <div className="h-[60px] w-[260px] shadow-2xl bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <main className="h-full w-full pt-[56px] sm:p-10 sm:pt-[96px] sm:flex sm:justify-center gap-8">
      <div className="hidden xl:flex w-[380px] min-w-[320px] flex-col gap-8 p-4 rounded-[2.5rem] shadow-2xl bg-gray-500 animate-pulse">
        <Card />
        <Card />
      </div>
      <div className="h-full max-w-[660px] grow flex flex-col gap-8  p-4 rounded-[2.5rem] shadow-2xl bg-gray-500 animate-pulse">
        <User />
        <Card />
      </div>
      <div className="hidden h-full lg:block w-[380px] min-w-[320px] rounded-[2.5rem] shadow-2xl p-4 bg-gray-500 animate-pulse">
        <div className="h-full rounded-[2.5rem] shadow-2xl p-4 bg-gray-400 animate-pulse">
          <Title />
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;
