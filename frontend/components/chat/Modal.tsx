"use client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setisopen } from "@/redux/features/globalState";
import { ToastContainer, toast } from "react-toastify";
import useAmiski from "@/hookes/useAmsiki";
import React from "react";
import Mute from "@/components/chat/modals/Mute";
import LeaveChannel from "@/components/chat/modals/LeaveChannel";
import AddFriend from "@/components/chat/modals/AddFriend";
import UpdateChannel from "@/components/chat/modals/UpdateChannel";
import JoinChannel from "@/components/chat/modals/JoinChannel";
import { XCircle } from "lucide-react";

function Modal() {
  const dispatch = useDispatch<AppDispatch>();
  const showToast = () => {
    toast.success("This is a success notification!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false, // Show or hide the progress bar
      closeOnClick: true, // Close the toast when clicked
      pauseOnHover: true, // Pause autoClose on hover
      draggable: true, // Allow dragging to dismiss
      progress: undefined,
    });
  };
  const modalType: string = useSelector(
    (state: any) => state.globalState.modalTYpe
  );
  const isopen: boolean = useSelector((state: any) => state.globalState.isopen);
  const { divref } = useAmiski();
  return (
    <div
      className={`${
        isopen === true ? "" : "hidden"
      } fixed z-40 inset-0 overflow-auto scrollbar`}
    >
      <div className="flex items-center justify-center min-h-screen  ">
        <div className="fixed inset-0 bg-white opacity-[4%] "></div>
        <ToastContainer />
        <div ref={divref} className={`relative rounded-lg  text-black  z-10 `}>
          <button
            className=" absolute left-0  p-2  cursor-pointer z-50"
            onClick={() => dispatch(setisopen(false))}
          >
            <XCircle size={28} color="#EA5581" strokeWidth={1.5} />
          </button>
          <>
            {modalType === "joinchannel" ? (
              <JoinChannel type={modalType} />
            ) : null}
            {modalType === "settings" ? (
              <UpdateChannel type={modalType} />
            ) : null}
            {modalType === "addFriend" ? <AddFriend type={modalType} /> : null}
            {modalType === "leaveChannel" ? (
              <LeaveChannel type={modalType} />
            ) : null}
            {modalType === "mute" ? <Mute type={modalType} /> : null}
          </>
        </div>
      </div>
    </div>
  );
}
export default Modal;
