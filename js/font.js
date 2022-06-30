fc.font = {}

// TODO: control codes and special commands
// REF:  https://www.lexaloffle.com/dl/docs/pico-8_manual.html#Appendix_A
function text(s, x, y, font=0, col1, col0) {
	let i_list = encode(s, font)
	return str(i_list, x, y, font, col1, col0)
}

function chr(i, x, y, font=0, col1, col0) {
	let w = fc.font[font].w
	let h = fc.font[font].h
	if (!i) { return [w,h] }
	if ((x+w < 0) || (x>fc.width))  { return [w,h] } 
	if ((y+h < 0) || (y>fc.height)) { return [w,h] } 
	let font_width = fc.font[font].width
	let n_cols = parseInt(font_width / w)
	let u = w * (i % n_cols)
	let v = h * parseInt(i / n_cols)
	
	blit(x,y, u, v, w, h, font, col1, col0)
	return [w,h]
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
	let h = fc.font[font].h
	for (let i=0; i<i_list.length; i++) {
		chr(i_list[i], x+i*w, y, font, col1, col0)
	}
	return [w * i_list.length, h]
}

// BLIT PERFORMNCE:
//  v1  3.53 fps
//  v2  4.24 fps (+20%)
//  v3 10.75 fps (+200%)

// for internal use only?
// 8 pixels encoded on 1 value (default)
function blit_v1(x, y, u, v, w, h, font, c1, c0=-1) {
	let b = fc.font[font]
	//console.log('blit from font',font,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	for (let i=0; i<h; i++) {
		for (let j=0; j<w; j++) {
			let pos = (u+j)+(v+i)*b.width
			let mask = 1 << (u+j)%8
			if (b.data[pos>>3] & mask) {
				if ((c1==undefined) || (c1>=0)) {
					rect(x+j,y+i,1,1,c1)
				}
			} else {
				if (c0>=0) {
					rect(x+j,y+i,1,1,c0)
				}
			}
		}
	}
}

function blit_v2(x, y, u, v, w, h, font, c1, c0=-1) {
	let b = fc.font[font]
	//console.log('blit from font',font,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	for (let i=0; i<h; i++) {
		for (let j=0; j<w; j++) {
			let pos = ((u+j)+(v+i)*b.width)>>3
			let mask = 1 << (u+j)%8
			if ((mask<=128) && (j<w-1) && (b.data[pos]&mask) && (b.data[pos]&(mask<<1))) {
				rect(x+j,y+i,2,1,c1)
				j += 1
			}
			else if (b.data[pos] & mask) {
				rect(x+j,y+i,1,1,c1)
			} else {
				rect(x+j,y+i,1,1,c0)
			}
		}
	}
}

function blit_v3(x, y, u, v, w, h, font, c1, c0=-1) {
	let b = fc.font[font]
	//console.log('blit from font',font,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	for (let i=0; i<h; i++) {
		for (let j=0; j<w; j++) {
			let pos = ((u+j)+(v+i)*b.width)>>3
			let mask = 1 << (u+j)%8
			let m = 1
			let k = 0
			if (b.data[pos] & mask) {
				for (k=0; k < 8-(u+j)%8; k++) {
					if (!(b.data[pos]&(mask<<(k+1)))) {
						break
					}
				}
				rect(x+j, y+i, (k+1), 1, c1)
				j += k
			} else {
				for (k=0; k < 8-(u+j)%8; k++) {
					if ((b.data[pos]&(mask<<(k+1)))) {
						break
					}
				}
				rect(x+j, y+i, (k+1), 1, c0)
				j += k
			}
		}
	}
}

blit = blit_v3

// REF: https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
// REF: https://thewebdev.info/2021/03/20/how-to-get-image-data-as-a-base64-url-in-javascript/
// REF: https://stackoverflow.com/questions/60175359/javascript-canvas-drawimage-getimagedata#60175700
// REF: https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
// REF: https://www.w3schools.com/Tags/canvas_getimagedata.asp
// REF: https://dirask.com/posts/JavaScript-how-to-draw-pixel-on-canvas-element-n1e7Wp
