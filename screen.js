
// TODO: object (fc? scr?)
// TODO: color arg -> optional? remove?

function init(width, height, fps) {
	var screen = document.getElementById("screen")
	screen.innerHTML = `<canvas id="main_canvas" width="${width}" height="${height}""></canvas>`
	
	out = document.getElementById("output")
	cnv = document.getElementById("main_canvas")
	
	ctx = cnv.getContext("2d")
	ctx.imageSmoothingEnabled = false
}

// TODO: argument to init
colors = [
	// https://lospec.com/palette-list/sweetie-16
	"#1a1c2c","#5d275d","#b13e53","#ef7d57",
	"#ffcd75","#a7f070","#38b764","#257179",
	"#29366f","#3b5dc9","#41a6f6","#73eff7",
	"#f4f4f4","#94b0c2","#566c86","#333c57"
]
// TODO: automatic
draw_pal = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

function camera(x, y) {
	ctx.setTransform(1,0,0,1,x,y)
}

function cls(col) {
	rect(0,0, cnv.width, cnv.height, col)
}

function color(col) {
	if (col == undefined) { return }
	c = draw_pal[col]
	ctx.fillStyle = colors[c]
	ctx.strokeStyle = ctx.fillStyle
}

function pal(col1, col2) {
	// TODO: reset <- col1==col2==-1
	draw_pal[col1] = col2
}

function rect(x, y, w, h, col) {
	color(col)
	ctx.fillRect(x,y,w,h)
}

function blt(x, y, img_bank, u, v, w, h, colkey) {
	// TODO
}

// TODO: load img_bank

function _fullscreen() {
	var elem = cnv
	if (elem.requestFullscreen) {
		elem.requestFullscreen()
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen()
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen()
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen()
	}
}
