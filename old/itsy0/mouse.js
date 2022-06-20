// ---[ API ]-------------------------------------------------------------------

function mouse() {
	return [MX,MY,M1,M2,M3]
}

function mousebtn(b) {
	switch (b) {
		case 1:  return [M1,MX,MY,M1X,M1Y]
		case 2:  return [M2,MX,MY,M2X,M2Y]
		case 3:  return [M3,MX,MY,M3X,M3Y]
		default: return [0,MX,MY,-1,-1,-1]
	}
}

// ---[ MOUSE ]-----------------------------------------------------------------

var MX = -1
var MY = -1
var M1 = 0 // status -> 3210 3:down 2:held 1:up 0:none
var M2 = 0 // status -> 3210 3:down 2:held 1:up 0:none
var M3 = 0 // status -> 3210 3:down 2:held 1:up 0:none
var M1X = -1 // MX when button was pressed (status==3)
var M1Y = -1 // MY when button was pressed
var M2X = -1
var M2Y = -1
var M3X = -1
var M3Y = -1
var MW = 0

function on_mouse_move(e) {
	var bcr = cnv.getBoundingClientRect()
	var bcr_left = bcr.left
	var bcr_top = bcr.top
	var bcr_w = bcr.width
	var bcr_h = bcr.height
	
	var ratio = bcr_h/fc.h
	var width = fc.w * ratio
	var bcr_left = 0.5*(bcr_w-width)
	
	MX = (e.clientX - bcr_left) / ratio
	MY = (e.clientY - bcr_top) / ratio
}

function on_mouse_up(e) {
	if (e.button==0) {
		M1 = 1
	} else if (e.button==2) {
		M2 = 1
	}
}

function on_mouse_down(e) {
	if (e.button==0) {
		M1 = 3
		M1X = MX
		M1Y = MY
	} else if (e.button==2) {
		M2 = 3
		M2X = MX
		M2Y = MY
	} else if (e.button==1) {
		M3 = 3
		M3X = MX
		M3Y = MY
	}
}

// TODO
function on_wheel(e) {
	if (e.deltaY > 0) {
		MW = 1
	} else if (e.deltaY < 0) {
		MW = -1
	} else {
		MW = 0
	}
}

function mouse_after() {
	switch (M1) {
		case 3: M1=2; break
		case 1: M1=0; break
	}
	switch (M2) {
		case 3: M2=2; break
		case 1: M2=0; break
	}
	switch (M3) {
		case 3: M3=2; break
		case 1: M3=0; break
	}
}

_after.push(mouse_after)

document.addEventListener('mousemove',on_mouse_move)
cnv.addEventListener('mouseup',on_mouse_up)
cnv.addEventListener('mousedown',on_mouse_down)
cnv.addEventListener('wheel',on_wheel)
cnv.addEventListener("contextmenu",function(e){e.preventDefault()})
