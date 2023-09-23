import Image from "next/image";

interface Props {
  isActive: boolean;
  str: string;
  src: string;
}

const Title = ({ isActive, str, src }: Props) => {
  return (
    <div
      className={`h-[56px] w-fit m-auto p-2 flex justify-center hover:border-b border-blue ${
        isActive ? "border-b border-blue " : ""
      }`}
    >
      <Image src={src} alt={str} width={28} height={28} />
      <h2 className="hidden lg:inline text-[28px] text-red ml-4">{str}</h2>
    </div>
  );
};

export default Title;
