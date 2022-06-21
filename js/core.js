fc = {}

function trace(...args) {
	// TODO: option to turn on/off
	console.log(...args)
}

async function run(boot, update, draw) {
	fc.boot = boot
	fc.update = update
	fc.draw = draw
	fc.target_dt = 1000 / fc.fps
	
	await fc.boot()
	
	fc.ts = _time()
	function main_iter() {
		// TODO: check for already running
		// TODO: check for some stop iteration flag
		let t0 = _time()
		fc.update()
		let t1 = _time()
		fc.draw() // TODO: skip draw if necessary
		let t2 = _time()
	}
	
	setInterval(main_iter, fc.target_dt)
}

function _time() {
	return new Date().valueOf()
}
