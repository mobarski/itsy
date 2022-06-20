fc.banks2 = {}
fc.bank2 = null
fc.b2 = null

// ---[ API ]-------------------------------------------------------------------

function new_bank(b,bw,bh,sw=8,sh=8,c=0) {
	var bank = {}
	bank.bw = bw // bank width in sprites
	bank.bh = bh // bank height in sprites
	bank.sw = sw
	bank.sh = sh
	bank.b = b
	if (Array.isArray(c)) {
		bank.data = c
	} else {
		bank.data = []
		for (var i=0; i<bh; i++) {
			for (var j=0; j<bw; j++) {
				var spr = Array(sw*sh).fill(c)
				bank.data.push(spr)
			}
		}
		
	}
	fc.banks2[b] = bank
	bank2(b)
}

function bank2(b=null) {
	console.log(`switching bank2 to ${b}`)
	var b_prev = fc.b2
	if (b!=null) {
		fc.b2 = b
	}
	fc.bank2 = fc.banks2[fc.b2]
	return b_prev
}

function sget(n,x,y) {
	return fc.bank2.data[n][x+y*fc.bank2.sw]
}

function sset(n,x,y,c) {
	fc.bank2.data[n][x+y*fc.bank2.sw] = c
}

// -----------------------------------------------------------------------------

function _spr_get(n) {
	return fc.bank2.data[n]
}

function _spr_set(n,spr) {
	fc.bank2.data[n] = spr
}

function _serialize_bank(n,pack=true) {
	var out = []
	var b = fc.banks2[n]
	var data = _data_to_flat_array(b.data)
	var max_c = pack ? max(...data) : 63
	
	// header
	out.push(1) // ver
	out.push(b.bw, b.bh, b.sw, b.sh) // geometry
	out.push(max_c) // max color
	
	// data
	var packed = _array_to_packed_array(data,max_c)
	out = out.concat(packed)
	
	return out
}

function _serialize_bank3(n) {
	var out = []
	var b = fc.banks2[n]
	
	// header
	out.push(3) // ver
	out.push(b.bw, b.bh, b.sw, b.sh) // geometry
	
	// data
	for (var i in b.data) {
		out.push(ser_spr(i).slice(2)) // v3
	}
	
	return out
}

// TODO
function _deserialize_bank(raw) {
	var ver = raw[0]
	if (ver!=1) return null
	var bank = {}
	var [bw,bh,sw,sh,max_c] = raw.slice(1,6)
	var packed = raw.slice(6,raw.length)
	var flat_ar = _packed_array_to_array(packed,max_c)
	
	bank.bw = bw
	bank.bh = bh
	bank.sw = sw
	bank.sh = sh
	bank.data = _flat_array_to_data(flat_ar,bw,bh,sw,sh)
	
	return bank
}

// -----------------------------------------------------------------------------

function _data_to_flat_array(data) {
	return data.flat()
}

function _flat_array_to_data(ar,bw,bh,sw=8,sh=8) {
	var bn = bw*bh
	var sn = sw*sh
	var out = []
	for (var i=0; i<bn; i++) {
		var spr = ar.slice(sn*i,sn*(i+1))
		out.push(spr)
	}
	return out
}

// ??? WILL NOT BE USED - NOT LEAN
/*
function _data_to_array(data,bw,bh,sw,sh) {
	var out = Array(bw*bh).fill(0)
	var bw_n = Math.floor(bw/sw)
	var bh_n = Math.floor(bh/sh)
	for (var i=0; i<bh_n; i++) {
		for (var j=0; j<bw_n; j++) {
			var n = j+i*bw_n
			var spr = data[n]
			for (var y=0; y<sh; y++) {
				for (var x=0; x<sw; x++) {
					var spr_i = x + y*sw
					var out_i = i*bw*sh + j*sw + x + y*bw
					out[out_i] = spr[spr_i]
					// console.log(`${i} ${j} ${y} ${x} -> ${spr[spr_i]} @ ${out_i}`)
				}
			}
		}
	}
	return out
}
*/

// ??? WILL NOT BE USED - NOT LEAN
/*
function _array_to_data(ar,bw,bh,sw,sh) {
	var out = []
	var bw_n = Math.floor(bw/sw)
	var bh_n = Math.floor(bh/sh)
	for (var i=0; i<bh_n; i++) {
		for (var j=0; j<bw_n; j++) {
			var n = j+i*bw_n
			var spr = Array(sw*sh).fill(0)
			for (var y=0; y<sh; y++) {
				for (var x=0; x<sw; x++) {
					var spr_i = x + y*sw
					var ar_i = i*bw*sh + j*sw + x + y*bw
					spr[spr_i] = ar[ar_i]
				}
			}
			out.push(spr)
		}
	}
	return out
}
*/


// function bexport(n,w,h=0,fmt=null) {
	// var ar = _serialize_bank(n)
	// var im = _array_to_compact_imagedata(ar,w,h)
	// return _imagedata_to_url(im,fmt)
// }

// // TODO
// function bimport(n,url) {
	// var imagedata = (url)
	// var ar = _compact_imagedate_to_array(imagedata.data)
	// return _deserialize_bank(ar)
// }

// ---[ TEST ]-----------------------------------------------------------------

if (1) {
	new_bank(1,2,2,2,2)
	bank2(1)
	sset(0,0,0,10)
	sset(0,1,0,11)
	sset(0,0,1,12)
	sset(0,1,1,13)
	sset(1,0,0,20)
	sset(1,1,0,21)
	sset(1,0,1,22)
	sset(1,1,1,23)
	sset(2,0,0,30)
	sset(2,1,0,31)
	sset(2,0,1,32)
	sset(2,1,1,33)
	sset(3,0,0,40)
	sset(3,1,0,41)
	sset(3,0,1,42)
	sset(3,1,1,43)

	new_bank(2,2,2,2,2)
	bank2(2)
	sset(0,0,0,0)
	sset(0,1,0,1)
	sset(0,0,1,2)
	sset(0,1,1,3)
	sset(1,0,0,4)
	sset(1,1,0,5)
	sset(1,0,1,6)
	sset(1,1,1,7)
	sset(2,0,0,8)
	sset(2,1,0,9)
	sset(2,0,1,10)
	sset(2,1,1,11)
	sset(3,0,0,12)
	sset(3,1,0,13)
	sset(3,0,1,14)
	sset(3,1,1,15)

	new_bank(3,2,2,2,2)
	bank2(3)
	sset(0,0,0,0)
	sset(0,1,0,1)
	sset(0,0,1,2)
	sset(0,1,1,3)
	sset(1,0,0,0)
	sset(1,1,0,1)
	sset(1,0,1,2)
	sset(1,1,1,3)
	sset(2,0,0,0)
	sset(2,1,0,1)
	sset(2,0,1,2)
	sset(2,1,1,3)
	sset(3,0,0,0)
	sset(3,1,0,1)
	sset(3,0,1,2)
	sset(3,1,1,3)

	new_bank(4,2,2,2,2)
	bank2(4)
	sset(0,0,0,0)
	sset(0,1,0,1)
	sset(0,0,1,0)
	sset(0,1,1,1)
	sset(1,0,0,0)
	sset(1,1,0,1)
	sset(1,0,1,0)
	sset(1,1,1,1)
	sset(2,0,0,0)
	sset(2,1,0,1)
	sset(2,0,1,0)
	sset(2,1,1,1)
	sset(3,0,0,0)
	sset(3,1,0,1)
	sset(3,0,1,0)
	sset(3,1,1,1)

}
