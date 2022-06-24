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
