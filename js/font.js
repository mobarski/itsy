fc.font = {}

function text(s, x, y, font=0, col1, col0) {
	let i_list = encode(s, font)
	return str(i_list, x, y, font, col1, col0)
}

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

// for internal use only?
function encode(s, font=0) {
	let i_list = []
	let charmap = fc.font[font].charmap || {}
	for (let j=0; j<s.length; j++) {
		let i = charmap[s[j]] || 0
		i_list.push(i)
	}
	return i_list
}

// for internal use only?
function str(i_list, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	for (let i=0; i<i_list.length; i++) {
		chr(i_list[i], x+i*w, y, font, col1, col0)
	}
	return w * i_list.length
}

// for internal use only?
// 8 pixels encoded on 1 value (default)
function blit(x, y, u, v, w, h, font, c1, c0) {
	let img = fc.ctx.getImageData(x,y,w,h)
	let b = fc.font[font]
	//console.log('blit from font',font,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	let r1,g1,b1
	let r0,g0,b0
	
	if (c1==undefined) { c1 = fc.color }
	if (c1>=0) {
		let dc1 = fc.draw_pal[c1]
		r1 = parseInt(fc.colors[dc1].substr(1,2), 16)
		g1 = parseInt(fc.colors[dc1].substr(3,2), 16)
		b1 = parseInt(fc.colors[dc1].substr(5,2), 16)
	}
	
	if (c0>=0) {
		let dc0 = fc.draw_pal[c0]
		r0 = parseInt(fc.colors[dc0].substr(1,2), 16)
		g0 = parseInt(fc.colors[dc0].substr(3,2), 16)
		b0 = parseInt(fc.colors[dc0].substr(5,2), 16)
	}
	
	for (let i=0; i<h; i++) {
		for (let j=0; j<w; j++) {
			let k = j*4 + i*w*4
			let pos = (u+j)+(v+i)*b.width
			let mask = 1 << (u+j)%8
			if (b.data[pos>>3] & mask) {
				if (c1>=0) {
					img.data[k+0] = r1
					img.data[k+1] = g1
					img.data[k+2] = b1
				}
			} else {
				if (c0>=0) {
					img.data[k+0] = r0
					img.data[k+1] = g0
					img.data[k+2] = b0
				}
			}
		}
	}
	fc.ctx.putImageData(img, x, y)
}

// REF: https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
// REF: https://thewebdev.info/2021/03/20/how-to-get-image-data-as-a-base64-url-in-javascript/
// REF: https://stackoverflow.com/questions/60175359/javascript-canvas-drawimage-getimagedata#60175700
// REF: https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
// REF: https://www.w3schools.com/Tags/canvas_getimagedata.asp
// REF: https://dirask.com/posts/JavaScript-how-to-draw-pixel-on-canvas-element-n1e7Wp
