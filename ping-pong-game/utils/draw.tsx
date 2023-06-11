
import { Bodies } from 'matter-js'

export function drawRect(x : number, y : number, w : number, h : number, color : string) {
	return (
		Bodies.rectangle(x, y, w, h, {
			isStatic: true,
			render: {
				fillStyle: color,
				strokeStyle: 'pink',
				lineWidth: 2,
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
					sprite: {
						texture: 'https://cdn.shopify.com/s/files/1/0009/2733/4466/products/755957ca0e8d95bb1d4e9ac2c8083de9.png?v=1539975508',
						xScale: 0.05,
						yScale: 0.05,
					}
					// fillStyle: color,
					// strokeStyle: 'pink',
					// lineWidth: 2,
			},
		})
	)
}