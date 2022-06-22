// TODO: mouse - x,y,button1
// TODO: left,right,up,down A B
// TODO: start / select

function on_mouse_move(e) {
	var bcr = fc.cnv.getBoundingClientRect()
	
	let ratio = bcr.height/fc.height
	let bcr_top = bcr.top
	let bcr_left = ratio==1 ? bcr.left : 0.5*(bcr.width - fc.width * ratio)
	
	let mx = e.clientX - bcr_left
	let my = e.clientY - bcr_top
	
	fc.mx = parseInt(mx / ratio) - fc.camera_x
	fc.my = parseInt(my / ratio) - fc.camera_y
	
	console.log('mouse_move', fc.mx, fc.my, e) // XXX
}

function on_mouse_down(e) {
	console.log('mouse_down', fc.mx, fc.my, e) // XXX
	rect(fc.mx, fc.my, 1, 1, 7)
}

function on_mouse_up(e) {
	console.log('mouse_up', fc.mx, fc.my, e) // XXX
}

function on_wheel(e) {
	console.log('mouse_wheel', fc.mx, fc.my, e) // XXX
}

function init_input() {
	fc.mx = -1
	fc.my = -1
	fc.cnv.addEventListener('contextmenu', function(e){e.preventDefault()})
	document.addEventListener('mousemove', on_mouse_move)
	document.addEventListener('mouseup',   on_mouse_up)
	document.addEventListener('mousedown', on_mouse_down)
	document.addEventListener('wheel',     on_wheel)
}
