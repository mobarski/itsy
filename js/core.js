fc = {}

async function run(boot, update, draw) {
	fc.boot = boot
	fc.update = update || function() {}
	fc.draw = draw || function() {}
	fc.target_dt = 1000 / fc.fps
	fc.draw_running = false
	fc.update_running = false
	fc.skip_draw = false
	fc.t0 = time()
	
	await fc.boot()
	
	function main_iter() {
		if (fc.update_running || fc.draw_running) {
			fc.skip_draw = true
			return
		}
		let t0 = time()
		fc.update_running = true
		fc.update()
		fc.update_running = false
		let t1 = time()
		
		if (!fc.skip_draw) {
			fc.draw_running = true
			fc.draw()
			fc.draw_running = false
		}
		let t2 = time()
		fc.skip_draw = false
	}
	
	fc.interval_id = setInterval(main_iter, fc.target_dt)
}

function halt() {
	clearInterval(fc.interval_id)
}

function time() {
	return new Date().valueOf() - (fc.t0||0)
}
