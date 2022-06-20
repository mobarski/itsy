// TODO: jakis dodatkowy prefix

function save(key,value) {
	localStorage['itsy_'+key] = JSON.stringify(value)
}

function load(key) {
	return JSON.parse(localStorage['itsy_'+key])
}

const CODE = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function _run_len_encode(text) {
	var out = ""
	for (var i=0; i<text.length;) {
		var c = text[i]
		var n = 1
		for (var j=1;j<CODE.length && i+j<=text.length;j++) {
			var c2 =text[i+j]
			//console.log(`i:${i} j:${j} c:${c} c2:${c2}`)
			if (c==c2) {
				n++
			} else if (n>=4) {
				out += '_'
				out += CODE[n]
				out += c
				i+=n-1
				break
			} else {
				out += c
				break
			}
		}
		i++
	}
	return out
}

function _run_len_decode(text) {
	var out = ""
	for (var i=0; i<text.length;) {
		var c = text[i]
		if (c=='_') {
			var c1 = text[i+1]
			var n = CODE.indexOf(c1)
			var c2 = text[i+2]
			for (var j=0; j<n; j++) {
				out += c2
			}
			i += 3
		} else {
			out += c
			i += 1
		}
	}
	return out
}
