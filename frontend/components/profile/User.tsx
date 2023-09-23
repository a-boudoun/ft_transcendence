"use client";

import Image from "next/image";
import { userDto } from "@/dto/userDto";
import uploadImage from "@/apis/uploadImage";
import { useMutation } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { Client } from "@/providers/QueryProvider";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import UserParametres from "@/components/profile/UserParametres";

const User = ({user, isMe} : {user : any, isMe: boolean}) => {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateBaner = useMutation({
    mutationKey: ["updateBaner"],
    mutationFn: async (user: userDto) => {
      await axios.patch("/users/updateMe", user);
    },

    onSuccess: () => {
      Client.refetchQueries(['User']);
    },
  });

  const status = "online";

  const handleChange = async (e: any) => {
    setIsLoading(true);
    const user: userDto = {};
    const uploadimage = await uploadImage(e.target.files[0]);
    user.baner = uploadimage;
    await updateBaner.mutate(user);
    await Client.refetchQueries(['User']);
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-hidden sm:rounded-3xl sm:shadow-2xl">
      <Image
        className="w-full h-full"
        src={user.baner}
        alt="baner"
        width={1000}
        height={1000}
      />
      {isMe && (
        <label className="absolute right-0 bottom-[110px] sm:bottom-[134px] bg-blue text-sm text-black rounded-2xl px-8 py-2 cursor-pointer ">
          change baner image
          {isLoading && (
            <Loader2
              className="absolute top-3 right-2 animate-spin"
              size={16}
              strokeWidth={1.2}
            />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/jpg, image/png, image/webp"
            onChange={handleChange}
          />
        </label>
      )}
      <div className="absolute flex gap-4 items-center bottom-0 w-full bg-black/50 p-3 sm:p-6">
        <Image
          className="rounded-full w-[86px] h-[86px]"
          src={user.image}
          alt="img"
          width={1000}
          height={1000}
        />
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-white text-xl sm:text-3xl">{user.username}</h2>
          {!isMe && (
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 sm:text-xl">{status}</span>
            </div>
          )}
        </div>
      </div>
      {!isMe && <UserParametres id={user.id} />}
    </div>
  );
};

export default User;