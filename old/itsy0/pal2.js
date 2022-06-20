
function parse_pal(str) {
	var colors = str.match(/#[0-9a-f]{6}/g)
	var rgb = []
	var min_i = 0
	var min_y = 1000
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
	}
	
	// color 0 must have lowest luminance
	for (var i=0;i<min_i;i++) {
		rgb.push(rgb.shift())
	}
	
	// console.log(min_i,min_y)
	return rgb
}
