
// REF: https://mycolor.space/

fc.colors = [
	// https://lospec.com/palette-list/sweetie-16
	"#1a1c2c","#5d275d","#b13e53","#ef7d57",
	"#ffcd75","#a7f070","#38b764","#257179",
	"#29366f","#3b5dc9","#41a6f6","#73eff7",
	"#f4f4f4","#94b0c2","#566c86","#333c57"
]

function init(width, height, scale=1, fps=30, colors) {
	let screen = document.getElementById("screen")
	screen.innerHTML = `<canvas id="main_canvas" width="${width*scale}" height="${height*scale}""></canvas>`
	
	fc.cnv = document.getElementById("main_canvas")
	
	fc.ctx = fc.cnv.getContext("2d")
	fc.ctx.webkitImageSmoothingEnabled = false
	fc.ctx.msImageSmoothingEnabled = false
	fc.ctx.imageSmoothingEnabled = false
	
	// ENGINE_V2 - image/framebuffer based
	fc.framebuffer = new ImageData(width, height)
	fc.cnv_fb = document.createElement('canvas');
	fc.cnv_fb.width = width;
	fc.cnv_fb.height = height;
	fc.ctx_fb = fc.cnv_fb.getContext('2d');
	fc.ctx.scale(scale, scale)
	
	fc.scale = scale
	fc.width = width
	fc.height = height
	fc.fps = fps
	fc.camera_x = 0
	fc.camera_y = 0
	
	fc.color = 1
	if (colors) {
		fc.colors = colors
	}
	pal()
	
	// RGB MAPPING
	fc.rgb = {}
	for (let i=0; i<fc.colors.length; i++) {
		let r = parseInt(fc.colors[i].substr(1,2), 16)
		let g = parseInt(fc.colors[i].substr(3,2), 16)
		let b = parseInt(fc.colors[i].substr(5,2), 16)
		fc.rgb[i] = [r,g,b]
	}
	
	if (fc.has_mouse) { init_mouse() }
}

function camera(x, y) {
	fc.camera_x = x
	fc.camera_y = y
	fc.ctx.setTransform(1, 0, 0, 1, x*fc.scale, y*fc.scale)
}

function cls(col) {
	rect(0,0, fc.cnv.width, fc.cnv.height, col)
}

function color(col) {
	if (col == undefined) { return fc.color }
	let prev_col = fc.color
	fc.color = col
	c = fc.draw_pal[col]
	fc.ctx.fillStyle = fc.colors[c]
	fc.ctx.strokeStyle = fc.ctx.fillStyle
	return prev_col
}

function pal(col1, col2) {
	if (col1>=0) {
		let prev_col = fc.draw_pal[col1]
		fc.draw_pal[col1] = col2
		return prev_col
	} else {
		fc.draw_pal = []
		for (let i=0; i<fc.colors.length; i++) {
			fc.draw_pal.push(i)
		}
	}
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

// ENGINE v2 - image/framebuffer operations
function rect(x,y,w,h,col) {
	
	let c = fc.draw_pal[col]
	let rgb = fc.rgb[c]
	let r = rgb[0]
	let g = rgb[1]
	let b = rgb[2]
	
	let data = fc.framebuffer.data
	
	for (let i=0; i<h; i++) {
		let row_offset = (y+i)*4*fc.width
		for (let j=(x+0)*4+row_offset; j<(x+w)*4+row_offset; j+=4) {
			data[j+0] = r
			data[j+1] = g
			data[j+2] = b
			data[j+3] = 255
		}
	}
}

function flip() {
	fc.ctx_fb.putImageData(fc.framebuffer, 0, 0)
	fc.ctx.drawImage(fc.cnv_fb, 0, 0)
}

