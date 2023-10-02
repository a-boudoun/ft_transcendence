FROM node:alpine

WORKDIR /trans

COPY . .

RUN npm install

EXPOSE 3000

# CMD ["npm", "run", "dev"]

RUN npm run build
CMD ["npm", "run", "start"]

        #  <button
        #     className={`flex flex-col items-center gap-4`}
        #     onClick={() => setmapToLocalStorage("default")}
        #   >
        #     <div
        #       className={`${
        #         selectedMap === "default"
        #           ? " shadow-[0_20px_50px_rgba(_134,_195,_187,_1)]"
        #           : ""
        #       } rounded-xl  max-w-[260px] hover:shadow-[0_20px_50px_rgba(_134,_195,_187,_1)]`}
        #     >
        #       <Image
        #         width={260}
        #         height={0}
        #         alt="#"
        #         src="/game/default-map-select.svg"
        #         className="h-full w-full"
        #       />
        #     </div>
        #     <p className="text-white text-center mt-[10px] font-bold">
        #       default
        #     </p>
        #   </button>