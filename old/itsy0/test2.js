function _init() {
}

function _main() {	
	status(`t1:${fc.t1}  t2:${fc.t2}  t3:${fc.t3}  t4:${fc.t4}`)
}

function _draw() {
	color(3)
	for (var i=0;i<500;i++) {
		for (var j=0;j<500;j++) {
			rect(i,j,50,50,1,0.5)
		}
	}
}
