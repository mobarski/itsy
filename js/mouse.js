
fc.has_mouse = true

// TBD: mouse wheel as another return value ???
// TBD: mouse buttons in another function ???
function mouse() {
	//console.log('mouse',fc.mouse_x, fc.mouse_y, fc.mouse_btn)
	return [fc.mouse_x, fc.mouse_y, fc.mouse_btn[1], fc.mouse_btn[2]]
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

// ===[ TOUCH ]================

// REF: https://flaviocopes.com/touch-events/
// REF: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW22

function on_touch_start(e) {
	// TODO
	e.preventDefault()
	set_touch_xy(e)
	fc.mouse_btn_queue.push(1)
}

function on_touch_move(e) {
	// TODO
	e.preventDefault()
	set_touch_xy(e)
	fc.mouse_btn_queue.push(1)
}

function on_touch_end(e) {
	// TODO
	e.preventDefault()
	set_touch_xy(e)
	fc.mouse_btn_queue.push(0)
}

function set_touch_xy(e) {
	let bcr = fc.cnv.getBoundingClientRect()
	let ratio = fc.scale
	
	let mx = e.targetTouches[0].pageX
	let my = e.targetTouches[0].pageY
	
	fc.mouse_x = parseInt(mx / ratio)
	fc.mouse_y = parseInt(my / ratio)
}

// ===

function init_mouse() {
	fc.mouse_x = -1
	fc.mouse_y = -1
	fc.mouse_btn = {1:0, 2:0, 3:0}
	fc.mouse_buttons = 0
	fc.mouse_btn_queue = []
	//
	document.addEventListener('mousemove', on_mouse_move)
	document.addEventListener('mouseup',   on_mouse_up)
	document.addEventListener('mousedown', on_mouse_down)
	document.addEventListener('wheel',     on_wheel)
	//
	fc.cnv.addEventListener('touchstart', on_touch_start)
	fc.cnv.addEventListener('touchmove',  on_touch_move)
	fc.cnv.addEventListener('touchend',   on_touch_end)
	//
	fc.cnv.addEventListener('contextmenu', function(e){e.preventDefault()})
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
