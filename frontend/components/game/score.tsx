import React from "react";

interface score{
	left: number,
	right: number
}

function PlayersScore({ left, right } : score) {
	return (
	  <div className="flex justify-between absolute top-[160px] left-[100px] right-[100px]">
		<div className="text-5xl text-white mx-4">{left}</div>
		<div className="text-5xl text-white mx-4">{right}</div>
	  </div>
	);
}

export default PlayersScore;