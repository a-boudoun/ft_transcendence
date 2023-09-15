import { Bodies } from 'matter-js'

export function drawRect(x : number, y : number, w : number, h : number, color : string) {
	return (
		Bodies.rectangle(x, y, w, h, {
			isStatic: true,
			chamfer: { radius: 10 },
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
					fillStyle: color,
			},
		})
	)
}