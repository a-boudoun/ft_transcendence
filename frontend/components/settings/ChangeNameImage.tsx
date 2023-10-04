"use client";

import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { userSchema } from "@/models/user";
import { userDto } from "@/dto/userDto";
import uploadImage from "@/apis/uploadImage";
import { Client } from "@/providers/QueryProvider";
import axios from "@/apis/axios";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

const ChangeNameImage = ({ src, name }: { src: string; name: string }) => {
  const [image, setImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>(src);
  const [username, setUserName] = useState<string>(name);
  const [msg, setMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateUser = useMutation({
    mutationFn: async (user: userDto) => {
      await axios.patch("/users/updateMe", user);
    },
    onSuccess: () => {
      Client.refetchQueries(["user", "me"]);
      setIsLoading(false);
      setMsg("your account has been updated successfully");
    },
  });

  const handleChange = async (e: any) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.value.length > 0) setUserName(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (username === name && image === null) {
      setIsLoading(false);
      setMsg("no changes were made");
      return;
    }

    const validationResult =
      username === name
        ? await userSchema.safeParseAsync({ image: image })
        : await userSchema.safeParseAsync({ username: username, image: image });

    if (validationResult.success) {
      const user: userDto = {};
      user.username = username;
      if (image) {
        const uploadimage = await uploadImage(image);
        user.image = uploadimage;
      }
      await updateUser.mutate(user);
    } else {
      setIsLoading(false);
      setMsg(validationResult.error.errors[0].message);
    }
  };

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div>
        <h3 className="mb-6 text-xl font-bold text-blue">Account settings</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <label>
            <div className="relative hover:opacity-60">
              {imagePreview === "" ? (
                <div></div>
              ) : (
                <Image
                  priority
                  className="w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full cursor-pointer"
                  src={imagePreview}
                  width={1000}
                  height={1000}
                  alt="avatar"
                />
              )}
              <ImagePlus
                className="absolute bottom-5 right-0 sm:w-8 sm:h-8 bg-white bg-opacity-20 ackdrop-blur-lg drop-shadow-lg"
                color="black"
                size={26}
                strokeWidth={2}
              />
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/jpg, image/png, image/webp"
              />
            </div>
          </label>
          <input
            autoComplete={"off"}
            id={"name"}
            className="h-16 rounded-2xl text-black text-center focus:outline-0 focus:border-[2px] hover:opacity-60"
            type="text"
            placeholder={name}
          />
        </div>
        <button
          className="relative mt-6 h-16 rounded-2xl text-black text-center bg-blue px-14 hover:opacity-60"
          type="submit"
          onClick={() => {
            setIsLoading(true);
          }}
        >
          save
          {isLoading && (
            <Loader2
              className="absolute top-6 right-6 animate-spin"
              size={20}
              strokeWidth={1.2}
            />
          )}
        </button>
        {msg && (
          <p
            className={`${
              msg[0] === "y" ? "text-blue" : "text-red"
            } text-center mt-3`}
          >
            {msg}
          </p>
        )}
      </div>
    </form>
  );
};

export default ChangeNameImage;
