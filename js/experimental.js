
function dom_set(name, html) {
	let out = document.getElementById(name)
	if (out) {
		out.innerHTML = html
	}
}

function dom_add(name, html) {
	let out = document.getElementById(name)
	if (out) {
		out.innerHTML += html
	}
}



function tri(x,y,x2,y2,x3,y3,col) {
	color(col)
	fc.ctx.beginPath()
	fc.ctx.moveTo(x,y)
	fc.ctx.lineTo(x2,y2)
	fc.ctx.lineTo(x3,y3)
	fc.ctx.lineTo(x,y)
	fc.ctx.closePath()
	fc.ctx.fill()
}

function pattern() {
	// pico8 -> fillp(p)
	// TODO fc.ctx.createPattern(img, "repeat");
}

// REF: https://www.w3schools.com/Tags/canvas_createpattern.asp
// REF: http://members.chello.at/easyfilter/bresenham.js
