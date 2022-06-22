
// REF: https://mycolor.space/

fc.colors = [
	// https://lospec.com/palette-list/sweetie-16
	"#1a1c2c","#5d275d","#b13e53","#ef7d57",
	"#ffcd75","#a7f070","#38b764","#257179",
	"#29366f","#3b5dc9","#41a6f6","#73eff7",
	"#f4f4f4","#94b0c2","#566c86","#333c57"
]

function init(width, height, fps, colors) {
	let screen = document.getElementById("screen")
	screen.innerHTML = `<canvas id="main_canvas" width="${width}" height="${height}""></canvas>`
	
	fc.cnv = document.getElementById("main_canvas")
	
	fc.ctx = fc.cnv.getContext("2d")
	fc.ctx.webkitImageSmoothingEnabled = false
	fc.ctx.msImageSmoothingEnabled = false
	fc.ctx.imageSmoothingEnabled = false
	
	fc.width = width
	fc.height = height
	fc.fps = fps
	
	fc.color = 1
	if (colors) {
		fc.colors = colors
	}
	pal()
	
	init_input()
}

function camera(x, y) {
	fc.camera_x = x
	fc.camera_y = y
	fc.ctx.setTransform(1,0,0,1,x,y)
}

function cls(col) {
	rect(0,0, fc.cnv.width, fc.cnv.height, col)
}

function color(col) {
	if (col == undefined) { return }
	fc.color = col
	c = fc.draw_pal[col]
	fc.ctx.fillStyle = fc.colors[c]
	fc.ctx.strokeStyle = fc.ctx.fillStyle
}

function pal(col1, col2) {
	if (col1>=0) {
		fc.draw_pal[col1] = col2
	} else {
		fc.draw_pal = []
		for (let i=0; i<fc.colors.length; i++) {
			fc.draw_pal.push(i)
		}
	}
}

function rect(x, y, w, h, col) {
	color(col)
	fc.ctx.fillRect(x,y,w,h)
}

function fullscreen() {
	let elem = fc.cnv
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

