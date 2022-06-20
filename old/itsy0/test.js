function _init() {
	px = 300
	py = 300
	sx = 300
	sy = 200
	vx = 1.4
	vy = 0
	MG = 300
	font('30px Moonbeam')
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
	
	status(`t1:${fc.t1}  t2:${fc.t2}  t3:${fc.t3}  t4:${fc.t4}`)
}

function _draw() {
	cls(0)
	pen(3)
	
	//camera(-300,-300,2,2)
	//camera(Math.random()*10,Math.random()*10)
	//camera(0,0)

	circfill(px,py,12,1)
	
	circfill(sx,sy,2,2)
	
	print("¶®ΨѦ",sx+10,sy+10,3)
	
	color(1)
	line(sx,sy,sx+10*vx,sy+10*vy)
	
	rectfill(10,10,50,50,1)
	
	xrect(100,500,55,55,2,1,true)
	xrect(100,500,45,45,0,0.8,true)
	
	//camera(Math.random()*10-5,Math.random()*10-5)
	
	color(2)
	xprint('Au',100,500)
	
	shapefill(200,500, [50,0,50,50,0,50,-25,25],1)
	
	print("Hail to Crail",300,500,5)
	print("dv = 1.432",300,550,5)

	
	color(5)
	line(100,50,100,100)
	line(100,150)
	line(150,150)
	
	snap = snapshot(true,0,0,20,20)
	ctx.drawImage(snap,20,20)
}
