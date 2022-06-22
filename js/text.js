
function chr(i, x, y, bank=0, col1, col0) {
	let w = fc.bank[bank].w
	if (!i) { return w }
	let bank_width = fc.bank[bank].width
	let h = fc.bank[bank].h
	let n_cols = parseInt(bank_width / w)
	let u = w * (i % n_cols)
	let v = h * parseInt(i / n_cols)
	
	blit(x,y, u, v, w, h, bank, col1, col0)
	return w
}

function text(s, x, y, bank=0, col1, col0) {
	let i_list = []
	let charmap = fc.bank[bank].charmap || {}
	for (let j=0; j<s.length; j++) {
		let i = charmap[s[j]] || 0
		i_list.push(i)
	}
	return str(i_list, x, y, bank, col1, col0)
}

// for internal use only?
function str(i_list, x, y, bank=0, col1, col0) {
	let w = fc.bank[bank].w
	for (let i=0; i<i_list.length; i++) {
		chr(i_list[i], x+i*w, y, bank, col1, col0)
	}
	return w * i_list.length
}