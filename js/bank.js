fc.bank = {}

function blit(x, y, bank_id, u, v, w, h, c1, c0) {
	let img = fc.ctx.getImageData(x,y,w,h)
	let b = fc.bank[bank_id]
	console.log('blit from bank',bank_id,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	let r1,g1,b1
	let r0,g0,b0
	
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
			if (b.data[(u+j)+(v+i)*b.width]>0) {
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

function blit8(x, y, bank_id, u, v, w, h, c1, c0) {
	let img = fc.ctx.getImageData(x,y,w,h)
	let b = fc.bank[bank_id]
	console.log('blit8 from bank',bank_id,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	let r1,g1,b1
	let r0,g0,b0
	
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

function set_bank(b, data, width) {
	fc.bank[b] = {data:data, width:width, height:data.length/width}
}

function load_bank_from_id(b, id) {		
	let c = document.createElement('canvas')
	let cc = c.getContext('2d')

	let img = document.getElementById(id)
	cc.drawImage(img, 0, 0)
	let data = new Uint8Array(img.width * img.height)
	let image = cc.getImageData(0, 0, img.width, img.height)
	
	for (let i=0; i<image.data.length; i+=4) {
		data[i>>2] = image.data[i+0]>=128 ? 1 : 0
		if (i>4*256*156 && image.data[i]>=128) {
			console.log('OK OK OK') // XXX
			break
		}
	}
	console.log('bank',b,'image.data.length',image.data.length,'>>2',image.data.length>>2)
	
	
	fc.bank[b] = {data:data, width:img.width, height:img.height}
	img.remove()
	//img.style.visibility = "hidden"
	
	console.log('load_bank_from_id', b, fc.bank[b].data) // XXX
}


function load_bank_from_url(b, url) {	
	let c = document.createElement('canvas')
	let cc = c.getContext('2d')
	
	let img = new Image()
	img.onload = function() {
		cc.drawImage(img, 0, 0)
		let data = new Uint8Array(img.width * img.height)
		let image = cc.getImageData(0, 0, img.width, img.height)
		
		for (let i=0; i<image.data.length; i+=4) {
			data[i>>2] = image.data[i]>=128 ? 1 : 0
		}
		
		fc.bank[b] = {data:data, width:img.width, height:img.height}
		console.log('load_bank_from_url', b, fc.bank[b].data) // XXX
	}
	img.crossOrigin = "anonymous"
	img.src = url
}

async function load_bank_from_url_async(b, url) {	
	let c = document.createElement('canvas')
	let cc = c.getContext('2d')
	
	const img = await _load_image(url)
	
	cc.drawImage(img, 0, 0)
	let data = new Uint8Array(img.width * img.height)
	let image = cc.getImageData(0, 0, img.width, img.height)

	for (let i=0; i<image.data.length; i+=4) {
		data[i>>2] = image.data[i]>=128 ? 1 : 0
	}
	
	fc.bank[b] = {data:data, width:img.width, height:img.height}
	console.log('load_bank_from_url_async', b, fc.bank[b].data) // XXX

}

// REF: https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
// REF: https://thewebdev.info/2021/03/20/how-to-get-image-data-as-a-base64-url-in-javascript/
// REF: https://stackoverflow.com/questions/60175359/javascript-canvas-drawimage-getimagedata#60175700
// REF: https://stackoverflow.com/questions/10754661/javascript-getting-imagedata-without-canvas
// REF: https://www.w3schools.com/Tags/canvas_getimagedata.asp
// REF: https://dirask.com/posts/JavaScript-how-to-draw-pixel-on-canvas-element-n1e7Wp

async function _load_image(url) {
    let img;
    const image_promise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = url;
    });

    await image_promise;
    return img;
}
