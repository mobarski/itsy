
function chr(x, y, bank, i, col1, col0) {
	let w = fc.bank[bank].w
	if (!i) { return w }
	let bank_width = fc.bank[bank].width
	let h = fc.bank[bank].h
	let n_cols = parseInt(bank_width / w)
	let u = w * (i % n_cols)
	let v = h * parseInt(i / n_cols)
	
	blit(x,y, bank, u, v, w, h, col1, col0)
	return w
}

function str(x, y, bank, i_list, col1, col0) {
	let w = fc.bank[bank].w
	for (let i=0; i<i_list.length; i++) {
		chr(x+i*w, y, bank, i_list[i], col1, col0)
	}
	return w * i_list.length
}

function text(x, y, bank, s, col1, col0) {
	let i_list = []
	let charmap = fc.bank[bank].charmap || {}
	for (let j=0; j<s.length; j++) {
		let i = charmap[s[j]] || 0
		i_list.push(i)
	}
	console.log(charmap)
	console.log('text',s,i_list) // XXX
	return str(x, y, bank, i_list, col1, col0)
}
