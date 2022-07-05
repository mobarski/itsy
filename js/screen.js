
// REF: https://mycolor.space/

fc.colors = [
	// https://lospec.com/palette-list/sweetie-16
	"#1a1c2c","#5d275d","#b13e53","#ef7d57",
	"#ffcd75","#a7f070","#38b764","#257179",
	"#29366f","#3b5dc9","#41a6f6","#73eff7",
	"#f4f4f4","#94b0c2","#566c86","#333c57"
]

function init(width, height, scale=1, fps=30, colors, div_id='screen') {
	let screen = document.getElementById(div_id)
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
	
	// RESET FRAMEBUFFER - set alpha to 255, so we can skip setting it while drawing (+14% fps)
	let data = fc.framebuffer.data
	for (let i=3; i<data.length; i+=4) {
		data[i] = 255
	}
	
	if (fc.has_mouse) { init_mouse() }
	if (fc.has_sound) { init_sound() }
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
	fc.color = int(col)
	c = fc.draw_pal[fc.color]
	fc.ctx.fillStyle = fc.colors[c]
	fc.ctx.strokeStyle = fc.ctx.fillStyle
	return prev_col
}


// REF: https://en.wikipedia.org/wiki/Line_drawing_algorithm
// REF: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function line(x0, y0, x1, y1, col) {
	// vertical
	if (x0==x1) { return rect(x0, min(y0,y1), 1, abs(y1-y0), col) }
	// horizontal
	if (y0==y1) { return rect(min(x0,x1), y0, abs(x1-x0), 1, col) }
	
	// other
	let dx = Math.abs(x1 - x0)
	let sx = x0 < x1 ? 1 : -1
	let dy = -Math.abs(y1 - y0)
	let sy = y0 < y1 ? 1 : -1
	let error = dx + dy
	let e2
	
	for (;;) {
		rect(x0,y0,1,1,col)
		if ((x0==x1) && (y0==y1)) { break }
		e2 = 2 * error
		if (e2 >= dy) {
			if (x0==x1) { break }
			error += dy
			x0 += sx
		}
		if (e2 <= dx) {
			if (y0 == y1) { break }
			error += dx
			y0 += sy
		}
	}
}


function pal(col1, col2) {
	if (col1>=0) {
		col1 = int(col1)
		col2 = int(col2)
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
	if (col<0) { return }
	if (col==undefined) { col=fc.color }
	
	let c = fc.draw_pal[int(col)]
	if (c<0) { return }
	if (!(c in fc.rgb)) { console.log('invalid color col:',col,'c:',c) } // xxx
	let rgb = fc.rgb[c]
	let r = rgb[0]
	let g = rgb[1]
	let b = rgb[2]
	
	/*
	x = int(x)
	y = int(y)
	w = int(w)
	h = int(h)
	*/
	
	let data = fc.framebuffer.data
	
	// LIMIT x,y,w,h TO FRAMEBUFFER COORDS
	if ((x+w < 0) || (y+h < 0)) { return }
	if ((x > fc.width) || (y > fc.height)) { return }
	if (x < 0) {
		w += x
		x = 0
	}
	if (y < 0) {
		h += y
		y = 0
	}
	w = min(w, fc.width-x)
	h = min(h, fc.height-y)
	
	for (let i=0; i<h; i++) {
		let row_offset = (y+i)*4*fc.width
		for (let j=(x+0)*4+row_offset; j<(x+w)*4+row_offset; j+=4) {
			data[j+0] = r
			data[j+1] = g
			data[j+2] = b
			//data[j+3] = 255 // +14% fps without it
		}
	}
}

function flip() {
	fc.ctx_fb.putImageData(fc.framebuffer, 0, 0)
	fc.ctx.drawImage(fc.cnv_fb, 0, 0)
}

/*
function status(text) {
	let out = document.getElementById('status')
	out.innerHTML = text
}
*/