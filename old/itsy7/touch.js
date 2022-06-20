// ---[ API ]-------------------------------------------------------------------
// -----------------------------------------------------------------------------

function on_touch_start(e) {
	MX = e.touches[0].clientX
	MY = e.touches[0].clientY
	M1 = 3
}

function on_touch_end(e) {
	M1 = 0
}

function on_touch_move(e) {
	// TODO
}

function on_touch_cancel(e) {
	// TODO
}

cnv.addEventListener('touchstart',on_touch_start)
cnv.addEventListener('touchend',on_touch_end)
