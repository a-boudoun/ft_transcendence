
import { Bodies } from 'matter-js'

export function drawRect(x : number, y : number, w : number, h : number, color : string) {
	return (
		Bodies.rectangle(x, y, w, h, {
			isStatic: true,
			render: {
				fillStyle: color,
			},
		})
		)
	}
	
	export function drawCircle(x : number, y : number, r : number, color : string) {
		return (
			Bodies.circle(x, y, r, {
				restitution: 1, // Make the ball fully elastic
				friction: 0, // Remove friction
				frictionAir: 0, // Remove air friction
				inertia: Infinity, // prevent ball from slowing down
				render: {
					// sprite: {
					// 	texture: 'https://png.pngtree.com/png-clipart/20200226/original/pngtree-football-championship-realistic-soccer-ball-isolated-png-image_5316695.jpg',
					// 	xScale: 0.05,
					// 	yScale: 0.05,
					// }
					fillStyle: color,
					strokeStyle: 'pink',
					lineWidth: 2,
			},
		})
	)
}