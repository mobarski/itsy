
function chr(i, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	if (!i) { return w }
	let font_width = fc.font[font].width
	let h = fc.font[font].h
	let n_cols = parseInt(font_width / w)
	let u = w * (i % n_cols)
	let v = h * parseInt(i / n_cols)
	
	blit(x,y, u, v, w, h, font, col1, col0)
	return w
}

function text(s, x, y, font=0, col1, col0) {
	let i_list = []
	let charmap = fc.font[font].charmap || {}
	for (let j=0; j<s.length; j++) {
		let i = charmap[s[j]] || 0
		i_list.push(i)
	}
	return str(i_list, x, y, font, col1, col0)
}

// for internal use only?
function str(i_list, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	for (let i=0; i<i_list.length; i++) {
		chr(i_list[i], x+i*w, y, font, col1, col0)
	}
	return w * i_list.length
}