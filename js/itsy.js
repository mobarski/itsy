// ===[ core.js ]=================

fc = {}

async function run(boot, update, draw) {
	fc.boot = boot
	fc.update = update || function() {}
	fc.draw = draw || function() {}
	fc.skip_draw = false
	fc.update_cnt = 0
	fc.draw_cnt = 0
	fc.main_cnt = 0
	fc.main_total_ms = 0
	fc.t0 = time()
	
	await fc.boot()
		
	fc.target_dt = 1000 / fc.fps
	fc.interval_id = setInterval(main_iter, fc.target_dt)
}

function halt() {
	clearInterval(fc.interval_id)
	fc.interval_id = 0
}

function resume() {
	if (fc.interval_id) { return }
	fc.interval_id = setInterval(main_iter, fc.target_dt)
}

function time() {
	return new Date().valueOf() - (fc.t0||0)
}


function main_iter() {
	let t0 = time()
	
	if (fc.has_mouse) { proc_mouse() }
	
	// UPDATE
	fc.update_cnt += 1
	fc.update()
	
	// DRAW
	if (!fc.skip_draw) {
		fc.draw_cnt += 1
		fc.draw()
	}
	fc.skip_draw = false
	
	// END
	fc.main_total_ms += time()-t0
}

// ===[ screen.js ]=================


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

function rect(x, y, w, h, col) {
	let s = fc.scale
	color(col)
	fc.ctx.fillRect(x*s, y*s, w*s, h*s)
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


// ===[ mouse.js ]=================


fc.has_mouse = true

// TBD: mouse wheel as another return value ???
// TBD: mouse buttons in another function ???
function mouse() {
	//console.log('mouse',fc.mouse_x, fc.mouse_y, fc.mouse_btn)
	return [fc.mouse_x, fc.mouse_y, fc.mouse_btn]
}

// TODO: out of canvas behaviour
function set_mouse_xy(e) {
	let bcr = fc.cnv.getBoundingClientRect()
	
	let ratio = bcr.height/fc.height
	let bcr_top = bcr.top
	let bcr_left = ratio==fc.scale ? bcr.left : 0.5*(bcr.width - fc.width * ratio)
	
	let mx = e.clientX - bcr_left
	let my = e.clientY - bcr_top
	
	fc.mouse_x = parseInt(mx / ratio) - fc.camera_x
	fc.mouse_y = parseInt(my / ratio) - fc.camera_y
	//console.log('set_mouse',fc.mouse_x,fc.mouse_y)
}

function on_mouse_move(e) {
	set_mouse_xy(e)
	//console.log('mouse_move', fc.mouse_x, fc.mouse_y, e) // XXX
}

function on_mouse_down(e) {
	fc.xxx_ts = time()
	set_mouse_xy(e)
	fc.mouse_btn_queue.push(e.buttons)
	//console.log('mouse_down', fc.mouse_x, fc.mouse_y, e) // XXX
	//rect(fc.mouse_x-1, fc.mouse_y-1, 3, 3, 7) // XXX
}

function on_mouse_up(e) {
	set_mouse_xy(e)
	fc.mouse_btn_queue.push(e.buttons)
	//fc.mouse_buttons = e.buttons
	//console.log('mouse_up', fc.mouse_x, fc.mouse_y, e) // XXX
}

// TODO: remove ???
// REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
function on_wheel(e) {
	e.preventDefault()
	set_mouse_xy(e)
	let dx = e.deltaX
	let dy = e.deltaY
	console.log('mouse_wheel', fc.mouse_x, fc.mouse_y, dx, dy, e) // XXX
}

function init_mouse() {
	fc.mouse_x = -1
	fc.mouse_y = -1
	fc.mouse_btn = {1:0, 2:0, 3:0}
	fc.mouse_buttons = 0
	fc.mouse_btn_queue = []
	fc.cnv.addEventListener('contextmenu', function(e){e.preventDefault()})
	document.addEventListener('mousemove', on_mouse_move)
	document.addEventListener('mouseup',   on_mouse_up)
	document.addEventListener('mousedown', on_mouse_down)
	document.addEventListener('wheel',     on_wheel)
}

// TODO: mouse buttons as dict key (1,2,3) -> state (3-just pressed, 2-down, 1-just released, 0-up)
// state as bitmap 1-released 2-down 4-pressed
// !!! *pressed* and *released* can occur in the same frame !!!
// ??? pyxel -> btn btnp btnr ???
// btn(b, [device_id]) device: 0-mouse 1-pad1 2-pad2 ...
function proc_mouse() {

	for (let j in [1,2,3]) {
		if (fc.mouse_btn[j]==3) { fc.mouse_btn[j] = 2 }
		if (fc.mouse_btn[j]==1) { fc.mouse_btn[j] = 0 }
		if (fc.mouse_btn[j]==2) { fc.mouse_btn[j] = fc.mouse_buttons&(1<<(j-1)) ? 2 : 1 }
	}

	let pressed  = {1:0, 2:0, 3:0}
	let released = {1:0, 2:0, 3:0}
	let prev = fc.mouse_buttons
	
	let cnt = fc.mouse_btn_queue.length
	if (cnt==0) { return }
	
	for (let i=0; i<cnt; i++) {
		let b = fc.mouse_btn_queue.shift()
		for (let j in [1,2,3]) {
			let mask = 1 << (j-1)
			if ((b&mask) != (prev&mask)) {
				if (b&mask) { pressed[j]=1 } else { released[j]=1 }
			}
		}
		prev = b
	}
	
	for (let j in [1,2,3]) {
		if (pressed[j])              { fc.mouse_btn[j]=3 }
		else if (released[j])        { fc.mouse_btn[j]=1 }
	}
	
	//console.log(pressed, released, fc.mouse_btn)
	fc.mouse_buttons = prev
}

// ===[ font.js ]=================

fc.font = {}

// TODO: control codes and special commands
// REF:  https://www.lexaloffle.com/dl/docs/pico-8_manual.html#Appendix_A
function text(s, x, y, font=0, col1, col0) {
	let i_list = encode(s, font)
	return str(i_list, x, y, font, col1, col0)
}

function chr(i, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	let h = fc.font[font].h
	if (!i) { return w,h }
	let font_width = fc.font[font].width
	let n_cols = parseInt(font_width / w)
	let u = w * (i % n_cols)
	let v = h * parseInt(i / n_cols)
	
	blit(x,y, u, v, w, h, font, col1, col0)
	return [w,h]
}

// for internal use only?
function encode(s, font=0) {
	let i_list = []
	let charmap = fc.font[font].charmap || {}
	for (let j=0; j<s.length; j++) {
		let i = charmap[s[j]] || 0
		i_list.push(i)
	}
	return i_list
}

// for internal use only?
function str(i_list, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	let h = fc.font[font].h
	for (let i=0; i<i_list.length; i++) {
		chr(i_list[i], x+i*w, y, font, col1, col0)
	}
	return [w * i_list.length, h]
}

// for internal use only?
// 8 pixels encoded on 1 value (default)
function blit(x, y, u, v, w, h, font, c1, c0=-1) {
	let b = fc.font[font]
	//console.log('blit from font',font,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	for (let i=0; i<h; i++) {
		for (let j=0; j<w; j++) {
			let pos = (u+j)+(v+i)*b.width
			let mask = 1 << (u+j)%8
			if (b.data[pos>>3] & mask) {
				if ((c1==undefined) || (c1>=0)) {
					rect(x+j,y+i,1,1,c1)
				}
			} else {
				if (c0>=0) {
					rect(x+j,y+i,1,1,c0)
				}
			}
		}
	}
}

// REF: https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
// REF: https://thewebdev.info/2021/03/20/how-to-get-image-data-as-a-base64-url-in-javascript/
// REF: https://stackoverflow.com/questions/60175359/javascript-canvas-drawimage-getimagedata#60175700
// REF: https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
// REF: https://www.w3schools.com/Tags/canvas_getimagedata.asp
// REF: https://dirask.com/posts/JavaScript-how-to-draw-pixel-on-canvas-element-n1e7Wp

// ===[ rom.js ]=================

fc.font[0] = {"data": [0,255,0,0,0,60,0,112,0,35,0,0,108,3,24,0,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0,0,0,149,0,0,0,24,24,120,32,55,0,192,142,4,60,32,255,255,255,255,255,255,255,255,255,1,0,128,0,0,128,1,0,21,6,96,0,60,60,60,96,190,14,232,0,8,126,96,255,255,255,24,3,192,3,0,192,1,0,128,0,0,128,1,0,0,0,0,60,126,60,12,224,223,7,108,70,8,24,255,255,255,255,24,3,192,3,0,192,1,0,128,0,0,192,3,0,255,14,112,24,0,24,116,220,255,51,0,39,99,24,255,15,240,0,24,3,192,3,0,192,1,0,128,128,1,192,3,0,149,22,104,60,126,24,254,248,251,31,54,35,151,24,96,15,240,0,24,3,192,3,0,192,1,0,128,192,3,224,7,0,245,38,100,60,126,60,251,246,125,111,119,108,134,24,32,15,240,0,24,255,255,3,0,192,1,0,128,224,7,224,7,0,0,0,0,24,60,126,123,251,191,223,99,6,0,24,0,15,240,0,24,255,255,3,0,192,1,0,128,240,15,240,15,126,67,99,127,0,0,0,0,120,255,59,0,0,0,24,0,15,240,15,24,195,255,3,255,192,1,255,128,240,15,240,15,126,91,107,127,240,0,0,0,124,239,113,12,66,64,24,4,15,240,15,24,195,255,3,255,192,1,129,128,224,7,248,31,0,24,8,0,200,0,0,0,182,243,239,14,97,128,24,6,15,240,15,24,195,195,3,195,192,1,129,128,192,3,248,31,48,2,0,12,128,1,4,32,248,191,31,38,41,136,24,255,15,240,15,24,195,195,3,195,192,1,129,128,128,1,252,63,24,18,0,24,128,1,2,64,252,191,3,16,7,200,24,255,255,255,15,24,195,195,3,195,192,1,129,128,0,0,252,63,12,12,0,48,0,19,2,64,238,119,55,17,8,44,126,6,255,255,15,24,195,195,3,195,192,1,129,128,0,0,254,127,6,0,0,96,0,15,6,96,240,251,111,113,72,96,60,4,255,255,15,255,255,195,3,255,192,1,129,128,0,0,254,127,2,0,0,64,0,0,30,120,248,255,1,3,56,64,24,0,255,255,15,255,255,195,3,255,192,1,255,128,0,0,255,255,0,62,124,0,0,0,120,30,192,191,27,0,0,0,24,0,0,0,0,255,3,192,3,0,192,1,0,128,224,7,0,128,0,31,248,0,0,15,96,6,232,63,51,1,8,128,60,36,0,0,0,255,3,192,3,0,192,1,0,128,248,31,0,224,0,15,240,0,0,19,64,2,108,123,13,5,24,160,126,102,0,0,0,24,3,192,3,0,192,1,0,128,60,60,0,248,4,15,240,0,128,1,64,2,132,205,24,9,18,208,24,255,248,31,255,24,255,255,3,0,192,1,0,128,14,112,0,254,68,15,240,240,128,1,32,4,160,46,3,10,1,18,24,255,248,31,255,24,255,255,3,0,192,1,0,128,6,96,128,255,84,15,240,164,200,0,0,0,48,102,6,48,9,28,126,102,24,24,0,24,3,192,3,0,192,1,0,128,7,224,224,255,85,31,248,245,240,0,0,0,16,66,0,0,79,0,60,36,24,24,0,255,3,192,255,255,255,1,0,128,3,192,248,255,85,62,124,85,0,0,0,0,0,0,0,0,56,0,24,0,24,24,0,255,3,192,255,255,255,255,255,255,3,192,254,255,0,126,60,60,0,0,60,60,0,0,6,0,0,0,0,192,24,24,24,195,24,195,24,24,0,0,252,63,3,192,254,255,0,255,62,124,0,0,48,12,126,126,47,106,68,120,0,32,24,24,24,195,24,231,24,24,0,0,254,127,3,192,248,255,0,255,70,98,0,0,47,244,102,102,79,106,42,68,0,16,24,24,24,195,24,126,24,24,0,0,7,224,7,224,224,255,0,255,98,70,112,14,31,248,102,24,70,106,42,66,0,16,248,31,24,255,255,60,24,24,31,248,3,192,6,96,128,255,63,195,98,70,24,24,63,252,0,24,64,0,16,90,60,16,248,31,24,255,255,60,56,28,63,252,3,192,14,112,0,254,127,129,96,6,216,27,63,252,102,102,102,86,0,66,66,16,0,0,24,195,24,126,112,14,112,14,3,192,60,60,0,248,89,0,224,7,152,25,62,124,102,126,60,6,42,126,129,32,0,0,24,195,24,231,224,7,224,7,3,192,248,31,0,224,89,0,192,3,248,31,60,60,0,0,0,0,0,0,129,192,0,0,24,195,24,195,192,3,192,3,3,192,224,7,0,128,89,0,62,124,248,31,255,255,0,0,0,96,6,0,129,3,0,0,0,0,24,129,192,3,192,3,3,192,224,7,128,1,89,0,119,238,152,25,255,255,102,94,110,144,9,192,129,4,0,0,0,0,24,66,224,7,224,7,3,192,24,24,192,3,127,129,97,134,216,27,163,197,102,18,96,144,9,96,66,8,0,0,255,0,24,36,112,14,112,14,3,192,4,32,224,7,63,195,1,128,24,24,1,128,0,94,110,96,6,54,60,8,0,0,255,255,31,24,56,28,63,252,3,192,2,64,240,15,0,255,226,71,112,14,1,128,126,0,96,6,96,28,0,8,0,0,255,255,31,24,24,24,31,248,3,192,2,64,248,31,0,255,208,11,0,0,1,128,66,94,110,9,144,8,0,8,0,0,255,24,24,36,24,24,0,0,7,224,1,128,252,63,0,255,16,8,0,0,163,197,126,94,96,9,144,0,0,4,192,3,0,24,24,66,24,24,0,0,254,127,1,128,254,127,0,126,32,4,0,0,255,255,0,0,0,6,96,0,0,3,192,3,0,24,24,129,24,24,0,0,252,63,1,128,255,255,0,128,219,1,255,255,0,0,230,115,0,0,0,0,1,255,192,3,60,24,24,3,192,24,24,3,0,0,1,128,255,255,0,112,219,14,249,159,96,3,247,103,0,0,0,0,1,255,192,3,60,24,24,7,224,28,56,15,248,31,1,128,254,127,0,240,189,15,248,31,112,7,251,15,118,62,126,0,3,255,0,0,60,24,24,14,112,14,112,63,252,63,1,128,252,63,0,236,255,55,252,63,120,15,251,111,7,93,126,0,3,0,0,0,60,248,255,28,56,199,227,255,254,127,2,64,248,31,252,220,60,59,255,255,124,31,253,111,123,67,125,0,3,255,0,0,60,248,255,56,28,227,199,255,254,127,2,64,240,15,254,242,219,79,255,255,126,63,253,111,124,59,123,0,3,0,0,0,60,24,0,112,14,112,14,252,254,127,4,32,224,7,154,118,219,110,255,255,62,62,254,95,127,123,59,60,1,0,0,0,60,24,0,224,7,56,28,240,254,127,24,24,192,3,154,63,255,252,255,255,0,0,254,63,0,0,0,255,1,0,0,0,60,24,0,192,3,24,24,192,126,126,224,7,128,1,154,0,0,0,0,192,0,0,255,127,111,111,63,128,255,255,0,126,248,0,0,0,0,248,31,192,126,126,224,7,224,7,154,126,0,96,96,224,124,30,255,127,111,110,127,128,60,251,255,126,248,0,0,0,0,248,31,240,254,127,248,31,248,31,254,161,0,112,96,80,124,30,254,31,95,97,127,192,0,241,255,126,24,0,0,0,0,24,24,252,254,127,252,63,252,63,252,161,0,56,16,14,120,14,252,111,63,93,31,192,0,0,255,126,24,248,31,255,255,24,24,255,254,127,254,127,254,127,0,255,255,28,8,13,112,6,225,111,127,62,111,192,0,119,255,126,24,248,31,255,255,24,24,255,254,127,30,120,254,127,0,173,173,12,4,9,96,0,219,119,127,127,112,192,0,0,255,126,24,0,0,3,192,24,24,63,252,63,15,240,255,255,0,161,161,2,2,6,0,0,215,55,126,127,119,128,0,0,255,126,248,0,0,3,192,24,24,15,248,31,15,240,255,255,0,255,255,0,0,0,0,0,0,0,0,0,0,128,0,0,0,126,248,0,0,3,192,24,24,3,0,0,15,240,255,255,127,254,62,124,60,60,48,12,255,248,255,255,223,251,255,0,51,15,31,0,24,3,192,24,24,0,128,1,15,240,255,255,255,255,126,126,255,255,48,12,255,252,127,254,207,243,255,0,51,15,31,0,24,3,192,24,24,0,192,3,15,240,255,255,239,247,124,62,255,219,184,29,255,252,63,252,119,238,102,0,204,15,24,0,24,3,192,24,24,0,224,7,15,240,255,255,199,227,120,30,255,231,184,29,159,248,15,240,51,204,96,0,204,15,24,24,24,255,255,24,24,0,240,15,30,120,254,127,199,227,126,126,126,102,24,24,15,240,3,192,29,184,0,6,51,240,24,24,24,255,255,24,24,24,120,30,254,127,254,127,70,98,6,96,60,60,0,0,6,224,1,128,12,48,0,102,51,240,24,24,0,0,0,24,24,60,60,60,252,63,252,63,6,96,12,48,60,60,0,0,0,224,1,128,7,224,0,255,204,240,31,24,0,0,0,248,31,126,30,120,248,31,248,31,6,96,24,24,60,60,0,0,0,240,0,0,3,192,0,255,204,240,31,24,0,0,0,248,31,255,15,240,224,7,224,7,60,60,126,126,120,30,0,0,192,3,254,127,16,0,3,192,85,5,80,48,3,48,0,128,1,255,15,240,224,7,0,0,60,60,127,254,252,63,0,0,192,3,255,255,24,8,7,240,170,10,160,48,3,48,0,192,3,126,30,120,248,31,0,0,124,62,119,238,236,55,128,1,240,15,192,3,60,24,7,240,85,5,80,192,12,192,0,224,7,60,60,60,252,63,224,7,236,55,243,207,220,59,192,3,240,15,215,235,126,60,3,192,170,10,160,192,12,192,0,240,15,24,120,30,30,120,240,15,206,115,239,247,217,155,224,7,252,63,116,46,102,126,3,192,85,5,80,48,3,0,3,240,15,0,240,15,14,112,248,31,199,227,204,51,227,199,112,14,252,63,7,224,66,102,15,224,170,10,160,48,3,0,3,224,7,0,224,7,199,227,252,63,99,198,198,99,254,127,48,12,255,255,120,30,66,66,15,224,85,5,80,192,12,0,12,192,3,0,192,3,231,231,252,63,227,199,195,195,124,62,48,12,255,255,126,126,36,36,3,192,170,10,160,192,12,0,12,128,1,0,128,1,231,231,252,63,231,60,0,0,64,0,0,0,0,126,94,122,60,48,120,12,0,85,0,51,0,0,192,3,0,24,0,0,231,231,252,63,231,60,0,16,128,6,30,120,60,195,191,66,126,96,252,6,0,170,0,51,0,0,48,12,0,24,0,0,231,231,252,63,66,24,195,32,144,6,34,68,78,141,161,74,243,192,96,71,0,85,20,204,0,0,12,48,0,60,0,0,199,227,252,63,0,0,231,32,96,0,90,90,143,141,191,114,225,195,128,199,0,170,40,204,0,0,3,192,0,60,128,1,14,112,248,31,0,0,231,34,4,0,90,90,129,129,169,64,224,231,193,199,85,0,20,0,51,192,0,0,3,126,192,3,30,120,240,15,66,24,195,28,8,0,68,34,98,161,191,112,240,255,255,231,170,0,40,0,51,48,0,0,12,126,224,7,252,63,224,7,231,60,0,0,9,64,120,30,36,195,191,72,248,127,254,239,85,0,0,0,204,12,0,0,48,255,112,14,248,31,0,0,231,60,0,0,6,0,0,0,24,126,191,0,120,62,124,94,170,0,0,0,204,3,0,0,192,255,56,28,224,7,0,0,119,119,119,0,254,127,255,255,255,239,0,122,124,30,122,62,0,252,60,63,255,128,1,1,128,255,56,28,0,0,0,0,119,119,34,0,255,255,255,255,255,247,0,66,254,31,247,127,0,254,126,127,255,64,2,1,128,255,112,14,0,0,0,0,34,34,0,0,159,249,255,255,255,120,24,122,255,15,231,255,85,255,255,255,255,32,4,2,64,126,224,7,0,0,0,0,0,0,0,0,159,249,255,255,255,6,12,66,231,7,227,131,170,255,255,255,255,16,8,2,64,126,192,3,224,7,0,0,0,0,0,0,255,255,121,158,255,12,112,122,195,135,227,1,85,255,255,255,255,8,16,4,32,60,128,1,240,15,192,3,0,136,0,136,201,147,49,140,153,0,246,66,3,207,226,6,170,255,255,255,255,4,32,4,32,60,0,0,56,28,224,7,0,221,136,221,192,3,51,204,219,0,247,122,6,126,96,63,0,254,255,127,126,2,64,8,16,24,0,0,24,24,240,15,0,221,221,221,255,255,255,255,255,0,0,66,12,60,48,30,0,252,255,63,60,1,128,8,16,24,0,0,24,24,240,15,60,60,60,0,60,66,192,3,255,199,128,222,187,3,64,0,20,17,136,153,204,187,221,16,8,0,192,3,24,24,240,15,126,126,126,0,126,129,192,3,231,239,216,222,187,27,96,0,40,34,68,51,102,119,238,16,8,17,240,15,24,24,240,15,126,126,126,60,126,189,48,12,255,239,216,222,187,25,240,15,20,68,34,102,51,238,119,32,4,17,252,63,56,28,224,7,126,126,24,126,219,255,176,13,153,0,0,0,0,0,248,31,40,136,17,204,153,221,187,32,4,51,255,255,240,15,192,3,66,90,90,90,153,189,204,51,105,189,204,123,183,39,252,63,20,17,136,153,204,187,221,64,2,51,255,255,224,7,0,0,102,126,126,90,255,219,236,55,102,189,238,123,183,111,252,255,40,34,68,51,102,119,238,64,2,119,252,63,0,0,0,0,102,102,102,126,60,126,243,207,0,0,238,123,183,111,124,126,20,68,34,102,51,238,119,128,1,119,240,15,0,0,0,0,102,60,60,36,36,36,251,223,24,0,0,0,0,0,60,60,40,136,17,204,153,221,187,128,1,255,192,3,0,0,0,0,0,0,126,126,0,0,251,223,248,255,126,255,0,0,60,60,0,24,0,192,3,0,0,0,0,255,128,1,0,0,0,0,60,60,126,126,126,254,243,207,228,255,126,251,70,0,127,254,0,24,0,224,7,0,0,0,0,119,224,7,0,0,0,0,126,254,126,126,129,129,236,55,228,126,126,255,110,12,254,127,0,0,0,112,14,0,0,0,0,119,248,31,0,0,0,0,255,255,102,102,129,129,204,51,185,0,126,251,44,12,252,63,3,0,0,48,12,0,0,255,0,51,254,127,224,7,0,0,255,127,102,102,195,67,176,13,177,126,0,249,0,96,248,31,3,0,24,48,12,60,128,0,1,51,128,1,16,8,0,0,126,126,102,100,90,90,48,12,236,126,126,160,102,112,240,15,0,0,36,112,14,126,64,0,2,17,224,7,8,16,0,0,102,102,102,96,90,86,192,3,236,126,255,251,108,48,0,0,0,0,66,224,7,231,32,0,4,17,248,31,8,16,128,1,102,96,231,96,102,96,192,3,240,126,255,251,0,0,0,0,0,0,129,192,3,195,16,0,8,0,254,127,8,16,192,3,60,255,255,32,60,0,0,0,0,192,3,62,44,255,252,0,0,0,129,128,1,195,8,0,16,0,60,0,8,16,192,3,126,255,255,48,60,0,0,60,24,239,247,119,38,255,120,48,0,0,66,64,2,231,8,0,16,60,126,60,8,16,128,1,231,219,255,255,252,0,0,102,24,239,247,99,66,241,112,24,0,0,36,32,4,126,8,0,16,102,255,126,8,16,0,0,195,219,219,255,124,17,0,96,24,239,247,98,2,238,100,36,0,192,24,16,8,60,8,24,16,66,255,126,16,8,0,0,195,255,255,255,60,51,68,56,24,239,247,36,12,235,98,126,0,192,0,16,8,0,8,24,16,66,255,126,224,7,0,0,195,195,231,255,63,119,102,0,0,239,247,16,16,115,50,126,0,0,0,32,4,0,8,0,16,102,255,126,0,0,0,0,195,231,219,6,62,119,119,24,24,239,247,16,16,191,134,126,24,0,0,64,2,0,8,0,16,60,126,60,0,0,0,0,195,255,255,4,60,119,119,0,0,192,3,32,0,222,76,60,24,0,0,128,1,0,8,0,16,0,60,0,0,0,0,0,195,127,127,60,60,111,54,0,3,0,0,0,119,0,0,32,3,24,0,0,0,0,16,0,8,60,0,0,0,0,0,60,195,127,127,60,60,110,4,128,3,94,0,0,119,0,0,16,12,24,0,0,0,0,32,0,4,126,0,0,0,0,24,66,195,96,99,60,252,12,0,128,1,0,0,0,119,0,0,16,48,36,0,0,0,0,64,0,2,231,80,5,240,15,36,153,195,111,107,60,124,0,0,0,0,54,0,0,119,10,16,72,192,36,0,0,96,6,128,0,1,195,168,10,248,31,90,189,195,99,107,60,60,0,0,128,0,0,0,0,119,37,24,41,192,66,0,0,112,14,0,255,0,195,84,21,252,63,90,189,0,127,123,60,60,0,0,192,1,110,0,0,119,69,107,235,48,66,96,6,56,28,0,0,0,231,168,42,252,63,36,153,195,127,123,126,126,0,0,192,1,0,18,8,119,69,119,255,12,129,224,7,24,24,0,0,0,126,84,20,124,62,24,66,195,0,0,255,255,0,0,0,0,0,91,44,119,110,54,126,3,129,192,3,0,0,0,0,0,60,40,40,60,60,0,60,255,231,231,0,0,24,24,63,252,96,6,240,15,0,255,7,192,129,192,3,0,0,0,0,0,60,20,20,60,60,0,0,129,129,129,102,102,60,231,127,254,255,255,16,8,60,255,31,48,129,224,7,24,24,0,24,24,66,40,42,124,62,0,0,165,129,189,255,153,255,129,252,63,226,71,16,8,24,239,15,12,66,96,6,56,28,0,24,60,129,84,21,252,63,24,24,153,0,60,255,129,126,66,254,127,148,41,16,8,60,230,7,3,66,0,0,112,14,102,0,126,129,168,42,252,63,60,36,153,0,60,255,129,60,66,254,127,72,18,16,8,66,98,3,3,36,0,0,96,6,102,0,126,129,80,21,248,31,60,36,165,129,189,126,66,126,153,240,15,40,20,16,8,129,32,63,12,36,0,0,0,0,0,24,60,129,160,10,240,15,24,24,129,129,129,60,36,231,231,120,30,24,24,16,8,129,0,31,48,24,0,0,0,0,0,24,24,66,0,0,0,0,0,0,255,231,231,24,24,0,0,56,28,8,16,240,15,255,0,15,192,24,0,0,0,0,0,0,0,60,0,0,0,0,0,0,224,7,224,7,192,3,128,0,7,112,14,0,129,128,1,0,2,64,0,0,1,128,1,128,0,24,252,63,192,3,0,0,16,8,16,8,224,7,192,96,9,248,31,0,129,192,3,60,2,64,254,127,6,96,6,96,24,60,2,64,224,7,0,0,200,19,200,19,224,7,192,112,9,252,63,0,129,224,7,114,2,64,2,64,30,120,30,120,60,126,1,128,240,15,0,0,232,87,232,23,224,7,192,56,9,254,127,0,255,112,14,241,2,64,2,64,60,60,124,62,60,126,1,128,240,15,0,0,232,87,232,23,224,7,0,28,15,127,254,255,0,56,28,255,2,64,2,64,60,60,252,63,60,126,1,128,240,15,60,60,168,85,42,84,40,20,250,20,15,63,252,129,0,16,8,94,2,64,2,64,120,30,248,31,60,126,1,128,240,15,126,66,232,87,42,84,168,21,250,36,9,31,248,129,0,12,48,44,2,64,2,64,120,30,224,7,24,60,1,128,224,7,255,153,192,3,192,3,128,1,122,0,7,14,112,129,0,12,48,24,2,64,2,64,240,15,128,1,0,24,1,128,192,3,255,189,30,120,14,112,50,76,128,0,1,112,14,0,0,60,60,0,0,0,2,64,240,15,128,1,0,0,1,128,192,3,255,189,248,31,254,127,202,83,192,6,3,152,25,6,96,78,126,24,255,0,2,64,120,30,224,7,0,60,1,128,32,4,255,153,246,111,252,63,58,92,192,12,3,156,57,60,60,159,255,36,0,0,2,64,120,30,248,31,60,126,1,128,144,9,126,66,238,119,0,0,250,95,192,24,3,254,127,88,26,159,255,36,0,0,2,64,60,60,252,63,126,255,1,128,208,11,60,60,108,54,152,25,248,31,192,56,3,127,254,176,13,159,189,60,0,0,2,64,60,60,124,62,126,255,1,128,208,11,0,0,160,5,184,29,248,31,0,40,0,57,156,224,7,159,129,60,0,0,2,64,30,120,30,120,60,126,1,128,144,9,0,0,160,5,176,13,112,14,192,36,3,25,152,192,3,78,66,24,0,255,254,127,6,96,6,96,0,60,2,64,32,4,0,0,0,0,160,5,96,6,192,0,3,14,112,0,0,60,60,0,0,0,0,0,1,128,1,128,0,0,252,63,192,3,0,0,112,56,14,0,0,0,0,0,0,240,15,0,0,60,60,0,0,240,192,3,192,3,0,240,15,0,192,3,0,240,15,0,152,68,25,60,121,60,160,29,24,252,63,0,0,66,114,24,0,252,192,3,32,4,0,15,240,0,224,7,0,255,255,0,236,56,55,176,27,13,160,61,36,207,243,252,63,129,249,24,0,63,224,7,16,8,224,0,0,7,240,15,224,255,255,7,246,124,111,182,91,109,0,48,36,51,204,218,91,189,249,60,192,15,224,7,8,16,24,0,0,24,248,31,248,255,255,31,123,124,222,54,89,108,240,7,60,12,48,153,153,255,249,60,240,3,112,14,8,16,4,0,0,32,248,31,252,255,255,63,61,124,188,27,88,216,26,76,24,0,0,194,67,255,249,126,252,0,112,14,4,32,2,0,0,64,252,63,254,255,255,127,29,68,184,27,88,216,219,109,24,0,0,188,61,126,114,90,63,0,56,28,4,32,1,0,0,128,252,63,255,255,255,255,14,56,112,8,80,16,195,97,0,0,0,128,1,60,60,126,15,0,56,28,4,32,1,0,0,128,252,63,255,255,255,255,199,0,227,7,0,224,0,0,160,36,0,0,0,56,28,0,15,0,28,56,2,64,1,0,0,128,254,127,255,255,255,255,251,48,223,7,112,224,60,60,208,36,0,0,114,68,34,0,63,0,28,56,2,64,1,0,0,128,254,127,255,255,255,255,227,48,199,0,112,0,66,2,208,255,0,0,12,58,92,24,252,0,14,112,2,64,2,0,0,64,254,127,254,255,255,127,96,48,6,7,0,224,47,244,208,36,24,24,255,10,80,60,240,3,14,112,2,64,4,0,0,32,254,127,252,255,255,63,48,48,12,14,48,112,33,4,208,36,16,8,12,26,88,126,192,15,7,224,1,128,24,0,0,24,255,255,248,255,255,31,24,0,24,28,48,56,47,244,32,255,18,72,255,84,42,90,0,63,7,224,1,128,224,0,0,7,255,255,224,255,255,7,6,120,96,16,0,8,65,2,192,36,62,124,12,72,18,126,0,252,3,192,1,128,0,15,240,0,255,255,0,255,255,0,31,72,248,0,48,0,30,120,192,36,48,12,114,48,12,0,0,240,3,192,1,128,0,240,15,0,255,255,0,240,15,0,24,0,0,0,0,0,0,0,1,16,124,0,24,24,255,0,3,192,24,3,1,128,0,0,128,1,255,255,0,0,128,1,24,8,16,0,0,127,254,128,3,48,68,0,60,60,0,0,249,159,24,7,1,128,0,0,64,2,255,255,0,0,192,3,60,8,16,0,60,230,103,192,0,112,124,8,24,126,126,0,4,32,24,14,1,128,0,0,32,4,255,255,0,0,224,7,255,62,56,8,90,228,39,0,1,80,68,24,60,24,0,102,2,64,24,252,1,128,0,0,32,4,255,255,0,0,224,7,255,8,254,28,153,252,63,128,0,144,68,40,126,60,0,153,2,64,60,252,2,64,240,15,16,8,254,127,240,15,240,15,60,8,56,8,66,252,63,0,1,28,102,12,24,126,60,0,2,64,126,14,2,64,12,48,16,8,254,127,252,63,240,15,24,0,16,0,60,252,63,128,3,30,119,12,60,24,129,255,2,64,231,7,2,64,2,64,16,8,254,127,254,127,240,15,24,0,16,0,0,120,30,192,0,14,51,0,24,24,255,126,2,64,195,3,2,64,1,128,16,8,254,127,255,255,240,15,255,255,239,255,255,255,0,0,0,0,219,0,219,3,0,0,2,64,195,192,4,32,1,128,16,8,252,63,255,255,240,15,201,129,239,127,127,255,60,60,60,60,219,15,219,103,255,0,2,64,231,224,4,32,2,64,16,8,252,63,254,127,240,15,165,189,239,67,67,223,102,98,90,90,24,104,0,14,189,0,2,64,126,112,4,32,12,48,16,8,252,63,252,63,240,15,147,165,0,67,91,217,90,74,102,70,223,107,95,60,129,102,2,64,60,63,8,16,240,15,16,8,248,31,240,15,240,15,201,165,221,67,91,255,66,90,102,94,216,11,16,56,129,255,2,64,24,63,8,16,0,0,32,4,248,31,0,0,224,7,165,189,0,67,67,219,90,66,90,102,27,251,246,131,189,255,4,32,24,112,16,8,0,0,32,4,240,15,0,0,224,7,147,129,183,127,127,231,60,60,60,60,192,11,22,254,126,129,249,159,24,224,32,4,0,0,64,2,224,7,0,0,192,3,255,255,0,129,129,255,0,0,0,0,255,251,240,131,0,126,3,192,24,192,192,3,0,0,128,1,192,3,0,0,128,1,0,128,0,0,3,0,0,128,0,0,3,0,0,60,16,8,60,252,60,252,0,0,15,240,0,0,0,0,224,7,240,15,0,64,0,0,4,0,0,192,0,0,7,0,60,36,48,12,66,2,126,254,0,0,15,240,0,0,0,0,248,31,8,16,0,32,0,6,4,0,0,224,0,6,7,0,126,36,191,253,129,1,231,7,0,1,7,224,0,0,0,0,252,63,228,39,192,35,14,137,100,0,192,227,14,143,103,0,90,24,191,253,129,1,195,3,0,3,3,192,0,0,8,16,206,115,18,72,32,28,145,112,152,15,224,255,159,255,255,15,90,126,188,61,129,1,195,3,0,3,192,3,0,0,48,12,198,99,201,147,28,0,96,0,0,16,252,255,255,255,255,31,126,126,188,61,129,1,195,7,0,1,224,7,128,1,240,15,199,227,37,164,2,0,0,0,0,96,254,255,255,255,255,127,60,24,60,60,129,2,195,254,24,0,240,15,192,3,224,7,255,255,149,169,1,0,0,0,0,128,255,255,255,255,255,255,0,24,24,24,129,252,195,252,60,0,240,15,224,7,224,7,255,255,85,170,8,1,128,15,1,128,112,24,129,0,0,60,16,16,56,108,129,63,195,63,0,60,3,192,224,7,224,7,255,255,85,170,16,2,96,31,3,224,252,60,129,0,0,66,56,56,56,254,129,64,195,127,0,24,1,128,192,3,224,7,255,255,149,169,16,4,16,31,7,240,254,126,126,60,24,153,124,124,254,254,129,128,195,224,128,0,0,0,128,1,240,15,199,227,37,164,16,4,8,31,7,248,255,126,126,126,36,36,254,254,254,254,129,128,195,192,192,0,0,0,0,0,48,12,198,99,201,147,8,4,8,15,7,248,255,255,126,126,36,36,254,124,254,124,129,128,195,192,192,0,0,0,0,0,8,16,206,115,18,72,4,4,8,7,7,248,254,255,60,126,153,24,56,56,56,56,129,128,231,224,128,0,0,0,0,0,0,0,252,63,228,39,4,8,16,7,15,240,252,255,0,129,66,0,124,16,124,16,66,64,126,127,0,0,128,1,0,0,0,0,248,31,8,16,8,8,16,15,15,240,112,126,0,129,60,0,0,124,0,0,60,63,60,63,0,0,192,3,0,0,0,0,224,7,240,15,16,16,8,31,31,248,14,126,0,0,0,126,126,126,0,0,3,192,255,255,255,255,1,128,15,240,255,255,255,255,3,192,32,16,8,63,31,248,63,255,60,60,0,255,255,255,32,4,13,176,1,128,2,64,3,192,63,252,255,255,255,255,7,224,32,16,8,63,31,248,127,255,124,62,0,153,7,224,48,12,49,140,2,64,4,32,5,160,255,255,7,224,14,112,15,240,16,8,8,31,15,248,255,255,240,15,0,165,251,223,120,30,193,131,2,64,8,16,9,144,243,207,7,224,28,56,31,248,8,8,4,15,15,252,255,126,248,31,153,126,173,181,172,53,1,128,4,32,16,8,17,136,195,195,14,112,56,28,59,220,8,112,2,15,127,254,127,126,224,7,219,153,173,181,172,53,1,128,4,32,32,4,33,132,3,192,14,112,112,14,115,206,8,128,1,15,255,255,63,60,112,14,255,66,252,63,252,63,1,128,8,16,64,2,65,130,3,192,28,56,224,7,227,199,16,128,1,31,255,255,14,24,0,0,255,60,120,30,120,30,1,128,8,16,128,1,129,129,3,192,28,56,192,3,195,195,0,224,3,0,224,3,24,0,0,0,0,0,0,0,0,0,1,128,8,16,128,1,129,129,3,192,28,56,192,3,195,195,12,24,4,12,248,7,6,96,6,0,0,24,24,24,48,12,1,128,8,16,64,2,65,130,3,192,28,56,224,7,227,199,18,4,8,30,252,15,56,144,9,0,0,24,26,88,120,30,1,128,4,32,32,4,33,132,3,192,14,112,112,14,115,206,18,4,16,30,252,31,192,144,9,0,0,126,60,60,190,125,1,128,4,32,16,8,17,136,195,195,14,112,56,28,59,220,18,4,16,30,252,31,96,160,5,12,48,60,126,126,144,9,193,131,2,64,8,16,9,144,243,207,7,224,28,56,31,248,36,56,12,60,248,15,24,128,1,18,72,36,18,72,56,28,49,140,2,64,4,32,5,160,255,255,7,224,14,112,15,240,66,64,2,126,192,3,6,128,1,2,64,36,16,8,40,20,13,176,1,128,2,64,3,192,63,252,255,255,255,255,7,224,129,128,1,255,128,1,24,128,1,252,63,0,0,0,72,18,3,192,255,255,255,255,1,128,15,240,255,255,255,255,3,192,129,129,255,255,4,0,16,128,1,252,63,0,0,60,60,129,255,0,0,0,240,15,0,0,192,3,170,255,0,24,0,0,66,145,255,126,6,0,96,128,1,2,64,0,0,126,66,60,238,136,0,0,240,15,0,0,192,3,170,0,0,60,0,0,66,105,111,126,74,4,24,128,1,18,72,0,0,126,137,94,238,136,0,0,0,0,0,0,192,3,170,255,96,60,0,6,34,6,6,62,169,4,14,160,5,12,48,0,60,126,169,94,204,204,0,0,0,0,0,0,192,3,170,0,240,24,0,15,36,0,0,60,17,139,112,144,9,0,0,0,126,24,153,78,204,204,0,0,0,0,192,3,0,0,170,255,240,0,24,15,72,0,0,120,16,82,32,144,9,0,0,0,126,60,129,66,136,238,0,0,0,0,192,3,0,0,170,0,96,0,60,6,72,0,0,120,0,80,16,96,6,0,0,0,24,24,66,60,136,238,240,15,0,0,192,3,0,0,170,255,0,0,60,0,48,0,0,48,0,32,8,0,0,0,0,0,24,24,60,129,0,255,240,15,0,0,192,3,0,0,170,0,0,0,24,0,0,0,102,0,16,0,0,8,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,92,24,102,76,124,6,28,12,48,12,84,24,0,0,0,96,28,16,60,60,48,62,60,126,60,60,12,12,32,0,4,60,94,60,34,254,6,102,38,4,24,24,56,24,0,0,0,48,38,24,98,98,24,6,6,96,70,70,12,12,48,60,12,102,94,60,0,76,62,48,28,0,24,24,254,126,0,60,0,24,78,28,112,56,12,62,62,56,60,70,0,0,24,0,24,102,92,60,0,76,124,24,118,0,24,24,56,24,0,0,0,12,86,24,56,96,46,64,70,24,70,124,0,0,12,60,48,48,88,24,0,254,96,12,38,0,24,24,84,24,8,0,12,6,102,24,28,98,62,66,70,12,70,66,12,8,24,0,24,24,88,0,0,76,62,102,124,0,48,12,16,0,12,0,12,2,60,24,126,60,48,60,60,6,60,60,12,12,48,0,12,0,88,24,0,0,8,96,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,32,0,4,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,28,30,28,14,62,126,28,70,60,126,70,6,70,70,28,30,28,30,60,126,70,70,70,102,70,126,56,6,28,24,0,66,38,38,38,22,6,6,38,70,24,96,70,6,110,78,38,38,38,38,70,24,70,70,70,60,70,48,24,12,24,60,0,90,70,70,6,38,6,6,6,70,24,96,38,6,86,86,70,70,70,70,62,24,70,38,70,24,70,24,24,24,24,102,0,122,126,62,6,70,30,30,102,126,24,96,30,6,70,102,70,62,86,62,124,24,70,22,86,60,60,12,24,48,24,0,0,50,70,70,70,70,6,6,70,70,24,98,38,6,70,70,70,6,38,38,98,24,70,14,110,102,24,6,24,96,24,0,0,4,70,126,60,62,126,6,124,70,60,60,70,126,70,70,60,6,92,70,60,24,60,6,70,66,24,126,56,64,28,0,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,0,0,0,0,0,0,34,24,0,0,0,6,6,8,16,24,40,0,24,0,0,8,16,24,36,2,48,24,12,0,60,152,252,40,40,16,56,34,20,24,136,17,12,8,8,16,8,36,20,36,24,252,28,16,8,36,0,6,24,24,24,0,70,24,38,126,124,60,76,28,8,24,204,51,18,4,4,0,0,0,0,0,0,38,38,62,62,62,62,4,24,24,24,76,31,60,38,48,6,86,12,20,62,0,102,102,18,2,8,62,62,62,62,62,62,38,6,6,6,6,6,0,12,24,48,126,6,24,102,24,124,22,30,28,8,24,51,204,12,14,6,70,70,70,70,70,70,126,6,30,30,30,30,0,24,24,24,50,31,25,38,12,98,86,12,34,62,24,102,102,0,0,0,126,126,126,126,126,126,38,70,6,6,6,6,0,24,24,24,0,70,14,252,126,60,60,126,0,8,24,204,51,0,0,0,70,70,70,70,70,70,230,60,126,126,126,126,0,48,0,12,0,60,0,0,0,0,16,0,0,0,0,136,17,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,8,16,24,0,0,40,8,16,24,40,0,0,8,16,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,8,36,36,30,20,16,8,36,20,36,28,16,8,36,36,32,36,6,30,48,40,24,28,126,126,90,60,24,60,60,94,0,0,0,0,38,0,0,0,0,0,0,38,0,0,0,0,16,0,62,38,28,28,24,38,0,12,90,70,24,66,66,116,60,60,60,60,70,70,60,60,60,60,60,86,70,70,70,70,70,70,70,70,38,38,44,70,0,24,90,70,44,90,90,84,24,24,24,24,94,78,70,70,70,70,70,78,70,70,70,70,60,60,70,54,6,6,44,94,60,24,60,70,44,74,74,0,24,24,24,24,70,86,70,70,70,70,70,70,70,70,70,70,24,24,62,70,70,70,70,70,0,12,24,36,70,90,74,0,60,60,60,60,62,102,60,60,60,60,60,60,60,60,60,60,24,24,6,70,60,60,126,60,126,126,60,102,70,66,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,0,0,60,60,0,0,0,0,20,0,0,0,0,36,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,32,0,0,0,126,126,30,62,62,86,60,70,24,124,30,22,30,62,70,28,70,102,70,86,86,30,70,12,60,102,124,12,48,0,0,0,6,6,38,6,6,84,98,70,66,76,22,22,38,6,70,54,70,102,70,86,86,24,70,12,98,86,98,28,56,0,0,0,62,6,38,6,62,56,96,102,102,76,22,22,70,62,70,86,70,102,70,86,86,24,70,12,96,86,98,60,60,0,0,0,70,6,38,30,70,56,56,86,86,76,118,126,70,70,124,86,70,124,70,86,86,120,94,60,120,94,124,60,60,0,0,0,70,6,38,6,70,84,98,78,78,76,86,86,70,70,64,86,70,96,70,86,86,88,86,44,98,86,100,56,28,0,0,0,126,6,126,126,38,86,60,70,70,70,51,54,70,70,62,60,254,96,126,126,254,56,78,28,60,54,98,48,12,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,128,0,24,0,128,0,0,0,0,0,0,32,4,0,0,0],"width": 256,"height": 256,"charmap": {"\u00b6": 864,"!": 930,"\"": 866,"#": 867,"$": 868,"%": 869,"&": 870,"'": 871,"(": 872,")": 873,"*": 874,"+": 875,",": 876,"-": 877,".": 878,"/": 879,"0": 880,"1": 881,"2": 882,"3": 883,"4": 884,"5": 885,"6": 886,"7": 887,"8": 888,"9": 889,":": 890,";": 891,"<": 892,"=": 893,">": 894,"?": 895,"@": 896,"A": 897,"B": 898,"C": 899,"D": 900,"E": 901,"F": 902,"G": 903,"H": 904,"I": 905,"J": 906,"K": 907,"L": 908,"M": 909,"N": 910,"O": 911,"P": 912,"Q": 913,"R": 914,"S": 915,"T": 916,"U": 917,"V": 918,"W": 919,"X": 920,"Y": 921,"Z": 922,"[": 923,"\\": 924,"]": 925,"^": 926,"_": 927,"`": 928,"{": 929,"}": 931,"~": 932,"\u20ac": 933,"\u0192": 934,"\u0152": 935,"\u017d": 936,"\u0160": 937,"\u00a2": 938,"\u00a3": 939,"\u00a4": 940,"\u00a5": 941,"\u00a6": 942,"\u00ab": 943,"\u00bb": 944,"\u00b0": 945,"\u00b2": 946,"\u00b3": 947,"\u00c0": 948,"\u00c1": 949,"\u00c2": 950,"\u00c3": 951,"\u00c4": 952,"\u00c5": 953,"\u00c6": 954,"\u00c7": 955,"\u00c8": 956,"\u00c9": 957,"\u00ca": 958,"\u00eb": 959,"\u00cc": 960,"\u00cd": 961,"\u00ce": 962,"\u00cf": 963,"\u00d0": 964,"\u00d1": 965,"\u00d2": 966,"\u00d3": 967,"\u00d4": 968,"\u00d5": 969,"\u00d6": 970,"\u00d8": 971,"\u00d9": 972,"\u00da": 973,"\u00db": 974,"\u00dc": 975,"\u00dd": 976,"\u0178": 977,"\u00de": 978,"\u00df": 979,"\u0106": 980,"\u010c": 981,"\u0394": 982,"\u03b8": 983,"\u039e": 984,"\u03a3": 985,"\u03a8": 986,"\u03a9": 987,"\u039b": 988,"\u00a9": 989,"\u00ae": 990,"\u2122": 991,"\u0411": 992,"\u0413": 993,"\u0414": 994,"\u00cb": 995,"\u0402": 996,"\u0416": 997,"\u0417": 998,"\u0418": 999,"\u0419": 1000,"\u041b": 1001,"\u0409": 1002,"\u040a": 1003,"\u041f": 1004,"\u040b": 1005,"\u0423": 1006,"\u0424": 1007,"\u0426": 1008,"\u0427": 1009,"\u040f": 1010,"\u0428": 1011,"\u0429": 1012,"\u042a": 1013,"\u042b": 1014,"\u042c": 1015,"\u042d": 1016,"\u042e": 1017,"\u042f": 1018},"rows": 32,"cols": 32,"w": 8,"h": 8}
fc.font[8] = {"data": [0,24,62,60,30,126,126,60,102,60,120,102,6,198,102,60,0,60,102,102,54,6,6,102,102,24,48,54,6,238,110,102,0,102,102,6,102,6,6,6,102,24,48,30,6,254,126,102,0,126,62,6,102,30,30,118,126,24,48,14,6,214,126,102,0,102,102,6,102,6,6,102,102,24,48,30,6,198,118,102,0,102,102,102,54,6,6,102,102,24,54,54,6,198,102,102,0,102,62,60,30,126,6,60,102,60,28,102,126,198,102,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,60,62,60,126,102,102,198,102,102,126,60,48,60,0,0,102,102,102,102,24,102,102,198,102,102,96,12,72,48,24,8,102,102,102,6,24,102,102,198,60,102,48,12,12,48,60,12,62,102,62,60,24,102,102,214,24,60,24,12,62,48,126,254,6,102,30,96,24,102,102,254,60,24,12,12,12,48,24,254,6,60,54,102,24,102,60,238,102,24,6,12,70,48,24,12,6,112,102,60,24,60,24,198,102,24,126,60,63,60,24,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,0,60,24,102,102,24,70,60,96,48,12,0,0,0,0,0,0,102,24,102,102,124,102,102,48,24,24,102,24,0,0,0,192,118,24,102,255,6,48,60,24,12,48,60,24,0,0,0,96,118,24,0,102,60,24,28,0,12,48,255,126,0,126,0,48,6,0,0,255,96,12,230,0,12,48,60,24,0,0,0,24,70,0,0,102,62,102,102,0,24,24,102,24,24,0,24,12,60,24,0,102,24,98,252,0,48,12,0,0,24,0,24,6,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,60,24,60,60,96,126,60,126,60,60,0,0,112,0,14,60,102,24,102,102,112,6,102,102,102,102,0,0,24,0,24,102,118,28,96,96,120,62,6,48,102,102,24,24,12,126,48,96,110,24,48,56,102,96,62,24,60,124,0,0,6,0,96,48,102,24,12,96,254,96,102,24,102,96,0,0,12,126,48,24,102,24,6,102,96,102,102,24,102,102,24,24,24,0,24,0,60,126,126,60,96,60,60,24,60,60,0,24,112,0,14,24,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,0,0,0,0,0,0,0,0,255,0,0,60,60,255,255,255,0,0,0,0,0,0,0,255,255,0,0,126,126,3,0,192,248,255,31,0,0,255,0,255,0,224,7,102,126,3,0,192,248,255,31,0,255,255,0,0,0,240,15,102,126,3,0,192,24,24,24,255,255,0,0,0,0,56,28,126,126,3,0,192,24,24,24,255,0,0,0,0,0,24,24,60,60,3,0,192,24,24,24,0,0,0,0,0,0,24,24,0,0,3,0,192,24,24,24,192,3,195,0,255,204,24,24,0,0,3,255,192,24,24,24,224,7,231,0,255,204,24,24,0,0,3,255,192,24,24,24,112,14,126,0,255,51,56,28,0,0,3,255,192,248,255,31,56,28,60,0,0,51,240,15,0,0,3,255,192,248,255,31,28,56,60,0,0,204,224,7,240,15,3,255,192,24,24,24,14,112,126,255,0,204,0,0,240,15,3,255,192,24,24,24,7,224,231,255,0,51,0,0,240,15,3,255,192,24,24,24,3,192,195,255,0,51,0,0,240,15,3,255,192,24,24,24,255,255,224,7,0,3,15,0,240,15,3,0,192,24,24,24,254,127,224,7,0,3,15,0,240,15,3,0,192,24,24,24,252,63,224,7,0,12,15,0,240,15,3,0,192,248,255,31,248,31,224,7,0,12,15,0,240,15,3,0,192,248,255,31,240,15,224,7,51,3,240,255,0,0,3,0,192,0,0,0,224,7,224,7,51,3,240,255,0,0,3,0,192,0,0,0,192,3,224,7,204,12,240,255,0,0,255,255,255,0,0,0,128,1,224,7,204,12,240,255,0,0,255,255,255,0,6,12,24,0,48,96,0,255,0,0,15,24,224,16,16,0,6,12,24,0,48,96,0,0,0,0,15,24,224,56,56,0,6,12,24,0,48,96,0,0,0,192,15,102,224,124,124,0,6,12,24,0,48,96,0,0,0,124,15,102,224,254,254,0,6,12,24,0,48,96,0,0,0,110,15,24,224,124,254,0,6,12,24,0,48,96,0,0,0,108,15,24,224,56,56,0,6,12,24,0,48,96,0,0,0,108,15,60,224,16,124,0,6,12,24,0,48,96,0,0,255,0,15,0,224,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,96,0,112,0,6,24,96,6,28,0,0,0,0,60,6,60,96,60,24,124,6,0,0,6,24,102,62,60,62,96,62,6,124,102,124,102,62,28,96,54,24,254,102,102,102,124,102,6,102,126,24,102,102,24,96,30,24,254,102,102,102,102,102,6,102,6,24,124,102,24,96,54,24,214,102,102,62,124,62,60,124,60,24,96,102,60,96,102,60,198,102,60,6,0,0,0,0,0,0,62,0,0,60,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,51,108,51,204,0,0,0,0,0,24,0,0,0,0,0,0,51,254,153,153,0,0,124,62,124,126,102,102,198,102,102,126,204,254,204,51,0,0,102,102,6,24,102,102,214,60,102,48,204,254,102,102,0,0,102,6,60,24,102,102,254,24,102,24,51,124,51,204,0,0,124,6,96,24,102,60,124,60,124,12,51,56,153,153,0,0,96,6,62,112,124,24,108,102,48,126,204,16,204,51,0,0,96,0,0,0,0,0,0,0,30,0,204,0,102,102,0,0],"width": 128,"height": 80,"charmap": {"A": 1,"B": 2,"C": 3,"D": 4,"E": 5,"F": 6,"G": 7,"H": 8,"I": 9,"J": 10,"K": 11,"L": 12,"M": 13,"N": 14,"O": 15,"P": 16,"Q": 17,"R": 18,"S": 19,"T": 20,"U": 21,"V": 22,"W": 23,"X": 24,"Y": 25,"Z": 26,"[": 27,"]": 29,"@": 32,"!": 33,"\"": 34,"#": 35,"$": 36,"%": 37,"&": 38,"'": 39,"(": 40,")": 41,"*": 42,"+": 43,",": 44,"-": 45,".": 46,"/": 47,"0": 48,"1": 49,"2": 50,"3": 51,"4": 52,"5": 53,"6": 54,"7": 55,"8": 56,"9": 57,":": 58,";": 59,"<": 60,"=": 61,">": 62,"?": 63,"a": 128,"b": 129,"c": 130,"d": 131,"e": 132,"f": 133,"g": 134,"h": 135,"i": 136,"j": 137,"k": 138,"l": 139,"m": 140,"n": 141,"o": 142,"p": 143,"q": 144,"r": 145,"s": 146,"t": 147,"u": 148,"v": 149,"w": 150,"x": 151,"y": 152,"z": 153},"rows": 10,"cols": 16,"w": 8,"h": 8}

