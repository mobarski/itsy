fc = {}

async function run(boot, update, draw, predraw, postdraw) {
	fc.boot = boot
	fc.update = update || function() {}
	fc.draw = draw || function() {}
	fc.predraw = predraw || function() {}
	fc.postdraw = postdraw || function() {}
	fc.target_dt = 1000 / fc.fps
	fc.is_running = 0
	fc.skip_draw = false
	fc.t0 = time()
	
	await fc.boot()
	
	function main_iter() {
		if (fc.is_running) {
			fc.skip_draw = true
			console.count('fc.is_running:'+fc.is_running)
			return
		}
		
		// UPDATE
		fc.is_running = 1
		fc.update()
		
		// PREDRAW
		fc.is_running = 2
		fc.predraw()
		
		// DRAW
		if (!fc.skip_draw) {
			fc.is_running = 4
			fc.draw()
		}
		fc.skip_draw = false
		
		// POSTDRAW
		fc.is_running = 8
		fc.postdraw()
		
		// END
		fc.is_running = 0
	}
	
	fc.interval_id = setInterval(main_iter, fc.target_dt)
}

function halt() {
	clearInterval(fc.interval_id)
}

function time() {
	return new Date().valueOf() - (fc.t0||0)
}
