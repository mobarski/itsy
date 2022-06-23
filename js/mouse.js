
fc.has_mouse = true

// TODO: mouse buttons
function mouse() {
	return fc.mouse_x, fc.mouse_y
}

// TODO: out of canvas behaviour
function set_mouse_xy(e) {
	let bcr = fc.cnv.getBoundingClientRect()
	
	let ratio = bcr.height/fc.height
	let bcr_top = bcr.top
	let bcr_left = ratio==1 ? bcr.left : 0.5*(bcr.width - fc.width * ratio)
	
	let mx = e.clientX - bcr_left
	let my = e.clientY - bcr_top
	
	fc.mouse_x = parseInt(mx / ratio) - fc.camera_x
	fc.mouse_y = parseInt(my / ratio) - fc.camera_y
}

function on_mouse_move(e) {
	set_mouse_xy(e)
	console.log('mouse_move', fc.mouse_x, fc.mouse_y, e) // XXX
}

function on_mouse_down(e) {
	set_mouse_xy(e)
	console.log('mouse_down', fc.mouse_x, fc.mouse_y, e) // XXX
	rect(fc.mouse_x-1, fc.mouse_y-1, 3, 3, 7)
}

function on_mouse_up(e) {
	set_mouse_xy(e)
	console.log('mouse_up', fc.mouse_x, fc.mouse_y, e) // XXX
}

function on_wheel(e) {
	set_mouse_xy(e)
	console.log('mouse_wheel', fc.mouse_x, fc.mouse_y, e) // XXX
}

function init_mouse() {
	fc.mouse_x = -1
	fc.mouse_y = -1
	fc.cnv.addEventListener('contextmenu', function(e){e.preventDefault()})
	document.addEventListener('mousemove', on_mouse_move)
	document.addEventListener('mouseup',   on_mouse_up)
	document.addEventListener('mousedown', on_mouse_down)
	document.addEventListener('wheel',     on_wheel)
}
