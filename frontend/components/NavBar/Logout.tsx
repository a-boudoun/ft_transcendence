"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/apis/axios";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const logout = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete("/auth/logout");
      return data;
    },
    onSuccess: () => {
      router.push("/");
    }, 
  });

  return (
    <button
      className="grid place-content-center h-[55px] w-[56px] hover:opacity-50"
      onClick={() => logout.mutate()}
    >
      <LogOut size={28} color="#EA5581" strokeWidth={1.5} />
    </button>
  );
};

export default Logout;