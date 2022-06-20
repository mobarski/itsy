
function sscale(sx,sy) {
	fc.ssx = sx
	fc.ssy = sy
}

function spr(n,x,y,flip_x=0,flip_y=0,sx=null,sy=null) {
	sx = sx || fc.ssx || 1
	sy = sy || fc.ssy || 1
	var sw = fc.bank2.sw
	var sh = fc.bank2.sh
	for (var i=0; i<sh; i++) {
		for (var j=0; j<sw; j++) {
			var _j = flip_x ? sw-1-j : j 
			var _i = flip_y ? sh-1-i : i
			var c = sget(n,_j,_i)
			rectfill(x+j*sx, y+i*sy, sx, sy, c)
			//console.log(x+j*sx, y+i*sy, sx, sy, c)
		}
	}
}

// ---[ SPR SER/DE ]-----------------------------------------------------------

function _serialize_spr(n) {
	var b = fc.bank2
	var data = b.data[n].slice()
	var colors = Array.from(new Set(data))
	var head = [b.sw, b.sh, colors.length]
	if (colors.length<=7) {
		head = head.concat(colors)
		if (colors.length>1) {
			for (var i in data) {
				data[i] = colors.indexOf(data[i])
			}
		} else {
			data = []
		}
	}
	return [head, data]
}

// TODO check length with and without transposition (+new head field)
function ser_spr(n) {
	var [head, data] = _serialize_spr(n)
	var max_c = head[2]
	if (max_c>1) {
		var packed = _array_to_packed_array(data,max_c,6)
		return _run_len_encode(head.concat(packed))
	} else {
		return _run_len_encode(head)
	}
}

function deser_spr(n,str) {
	fc.bank2.data[n] = _deser_spr(str)
}

function _deser_spr(str) {
	var all = _run_len_decode(str)
	var sw = all[0]
	var sh = all[1]
	var c_length = all[2]
	
	var head
	var data
	var unpacked
	var out = []
	if (c_length<=7) {
		head = all.slice(0, 3+c_length)
		var colors = head.slice(3)
		if (colors.length>1) {
			data = all.slice(3+c_length)
			unpacked = _packed_array_to_array(data,c_length-1,6)
			for (var i in unpacked) {
				if (i>=sw*sh) break
				out[i] = colors[unpacked[i]]
			}
		} else {
			out = Array(sw*sh).fill(colors[0])
		}
	} else {
		head = all.slice(0, 3)
		data = all.slice(3)
		out = data
	}
	return out
}
