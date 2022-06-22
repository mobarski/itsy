// TODO: rename stamp? 
function str(x, y, bank_id, w, h, ids, col1, col0) {
	let u,v,id
	let bank_width = fc.bank[bank_id].width
	let n_cols = parseInt(bank_width/w)
	for (let i=0; i<ids.length; i++) {
		id = ids[i]
		u = w * (id % n_cols)
		v = h * parseInt(id/n_cols)
		blit(x+i*w, y, bank_id, u, v, w, h, col1, col0)
	}
	return x + ids.length*w
}
