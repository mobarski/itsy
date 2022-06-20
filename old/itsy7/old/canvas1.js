var out = document.getElementById("output")
var c = document.getElementById("main_canvas")
var ctx = c.getContext("2d")

function snow() {
	var t = new Date().getTime()
	for (i=0;i<10000;i++) {
		x = Math.random()*c.width
		y = Math.random()*c.height
		ctx.fillRect(x,y,5,5)
	}
	out.innerHTML = new Date().getTime()-t
}
setInterval(snow,1)
