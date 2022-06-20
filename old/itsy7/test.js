function _init() {
	px = 300
	py = 300
	sx = 300
	sy = 200
	vx = 1.4
	vy = 0
	MG = 300
	ctx.font = '30px Monospace'
}

sign = Math.sign

function _main() {
	sx += vx
	sy += vy
	rx = sx-px
	ry = sy-py
	r2 = rx*rx + ry*ry
	f = MG / r2
	dvx = sign(rx) * f * rx*rx / r2
	dvy = sign(ry) * f * ry*ry / r2
	vx -= dvx
	vy -= dvy
}

function _draw() {
	cls(0)
	circ(px,py,12,1)
	circ(sx,sy,2,2)
	text("¶®ΨѦ",sx+10,sy+10,3)
}
