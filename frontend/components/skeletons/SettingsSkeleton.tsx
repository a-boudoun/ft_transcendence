const Box = () => {
  return (
    <div className="h-[60px] w-[200px] m-auto rounded-xl  bg-gray-300 animate-pulse"></div>
  );
};

const SettingsSkeleton = () => {
  return (
    <div className="my-8 flex flex-col items-center gap-8">
      <div className="h-4 w-60 bg-gray-300 animate-pulse"></div>
      <div className="flex gap-8">
        <div className="h-[200px] w-[200px] rounded-full bg-gray-300 animate-pulse"></div>
        <Box />
      </div>
      <Box />
      <div className="h-4 w-64 bg-gray-300 animate-pulse"></div>
      <div className="flex flex-col gap-2 items-center">
        <div className="h-4 w-80 bg-gray-300 animate-pulse"></div>
        <div className="h-4 w-72 bg-gray-300 animate-pulse"></div>
        <div className="h-4 w-60 bg-gray-300 animate-pulse"></div>
      </div>
      <Box />
      <div className="h-4 w-52 bg-gray-300 animate-pulse"></div>
      <div className="h-[460px] grow w-[400px] bg-gray-500 rounded-2xl animate-pulse">
      </div>
    </div>
  );
};

export default SettingsSkeleton;
