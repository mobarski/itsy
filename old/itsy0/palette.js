// ---[ API ]------------------------------------------------------------------

// TODO fc.pal.remap = {} ???
function palette(p) {
	if (p[0] != '#') {
		p = _palettes[p]
	}
	fc.pal.rgb = _parse_pal(p).slice()
	fc.pal.recalc()
}

function pal(c=null,c2=null) {
	if (c==null) {
		fc.pal.remap = {}
	} else {
		fc.pal.remap[c] = c2
	}
}

// TODO remap or not ???
function rgb(c) {
	return fc.pal.rgb[c]
}

// ----------------------------------------------------------------------------


fc.pal = {}
fc.pal.rgb = []
fc.pal.style = []
fc.pal.remap = {}

fc.pal.recalc = function() {
	this.length = this.rgb.length
	for (var i=0; i<this.length; i++) {
		var [r,g,b] = this.rgb[i]
		this.style[i] = `rgb(${r},${g},${b})`
	}
}

fc.pal.load = function(name) {
	this.rgb = palette[name].slice()
	this.recalc()
}

function _parse_pal(str) {
	var colors = str.match(/#[0-9a-f]{6}/gi)
	var rgb = []
	
	// min and max luminance
	var min_i = 0
	var min_y = 1000
	var max_i = 0
	var max_y = 0
	
	for (var i in colors) {
		var r = colors[i].slice(1,3)
		var g = colors[i].slice(3,5)
		var b = colors[i].slice(5,7)
		r = parseInt(r,16)
		g = parseInt(g,16)
		b = parseInt(b,16)
		rgb.push([r,g,b])
		y = 0.299*r + 0.587*g + 0.114*b // perceived luminance
		if (y < min_y) {
			min_y = y
			min_i = i
		}
		if (y > max_y) {
			max_y = y
			max_i = i
		}
	}
	
	// color 0 must have lowest luminance
	for (var i=0;i<min_i;i++) {
		rgb.push(rgb.shift())
	}
	
	console.log(min_i,min_y,rgb)
	return rgb
}
