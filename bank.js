bank = {}

function blit(x, y, bank_id, u, v, w, h, c1, c0) {
	img = ctx.getImageData(x,y,w,h)
	var b = bank[bank_id]
	console.log('blit from bank',bank_id,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	if (c1>=0) {
		var r1 = parseInt(colors[c1].substr(1,2), 16)
		var g1 = parseInt(colors[c1].substr(3,2), 16)
		var b1 = parseInt(colors[c1].substr(5,2), 16)
	}
	
	if (c0>=0) {
		var r0 = parseInt(colors[c0].substr(1,2), 16)
		var g0 = parseInt(colors[c0].substr(3,2), 16)
		var b0 = parseInt(colors[c0].substr(5,2), 16)
	}
	
	for (var i=0; i<h; i++) {
		for (var j=0; j<w; j++) {
			var k = j*4 + i*w*4
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
	ctx.putImageData(img, x, y)
}

function blit8(x, y, bank_id, u, v, w, h, c1, c0) {
	img = ctx.getImageData(x,y,w,h)
	var b = bank[bank_id]
	console.log('blit8 from bank',bank_id,'w',b.width,'h',b.height,'data',b.data) // XXX
	
	if (c1>=0) {
		var r1 = parseInt(colors[c1].substr(1,2), 16)
		var g1 = parseInt(colors[c1].substr(3,2), 16)
		var b1 = parseInt(colors[c1].substr(5,2), 16)
	}
	
	if (c0>=0) {
		var r0 = parseInt(colors[c0].substr(1,2), 16)
		var g0 = parseInt(colors[c0].substr(3,2), 16)
		var b0 = parseInt(colors[c0].substr(5,2), 16)
	}
	
	for (var i=0; i<h; i++) {
		for (var j=0; j<w; j++) {
			var k = j*4 + i*w*4
			var pos = (u+j)+(v+i)*b.width
			var mask = 1 << (u+j)%8
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
	ctx.putImageData(img, x, y)
}

function set_bank(b, data, width) {
	bank[b] = {data:data, width:width, height:data.length/width}
}

function load_bank_from_id(b, id) {		
	var c = document.createElement('canvas')
	var cc = c.getContext('2d')

	var img = document.getElementById(id)
	cc.drawImage(img, 0, 0)
	var data = new Uint8Array(img.width * img.height)
	var image = cc.getImageData(0, 0, img.width, img.height)
	
	for (var i=0; i<image.data.length; i+=4) {
		data[i>>2] = image.data[i+0]>=128 ? 1 : 0
		if (i>4*256*156 && image.data[i]>=128) {
			console.log('OK OK OK')
			break
		}
	}
	console.log('bank',b,'image.data.length',image.data.length,'>>2',image.data.length>>2)
	
	
	bank[b] = {data:data, width:img.width, height:img.height}
	img.remove()
	//img.style.visibility = "hidden"
	
	console.log('load_bank_from_id', b, bank[b].data) // XXX
}


function load_bank_from_url(b, url) {	
	var c = document.createElement('canvas')
	var cc = c.getContext('2d')
	
	var img = new Image()
	img.onload = function() {
		cc.drawImage(img, 0, 0)
		var data = new Uint8Array(img.width * img.height)
		var image = cc.getImageData(0, 0, img.width, img.height)
		
		for (var i=0; i<image.data.length; i+=4) {
			data[i>>2] = image.data[i]>=128 ? 1 : 0
		}
		
		bank[b] = {data:data, width:img.width, height:img.height}
		console.log('load_bank_from_url', b, bank[b].data) // XXX
		done_cnt += 1
	}
	img.crossOrigin = "anonymous"
	img.src = url
	load_cnt += 1
}

async function load_bank_from_url2(b, url) {	
	var c = document.createElement('canvas')
	var cc = c.getContext('2d')
	
	const img = await _load_image(url)
	
	cc.drawImage(img, 0, 0)
	var data = new Uint8Array(img.width * img.height)
	var image = cc.getImageData(0, 0, img.width, img.height)
	
	for (var i=0; i<image.data.length; i+=4) {
		data[i>>2] = image.data[i]>=128 ? 1 : 0
	}
	
	bank[b] = {data:data, width:img.width, height:img.height}
	console.log('load_bank_from_url2', b, bank[b].data) // XXX

}

// TODO: remove
function load_bank2(b, id) {
	var img = document.getElementById(id)
	img.crossOrigin = "Anonymous"
	var data = new Uint8Array(img.width * img.height)
	ctx.drawImage(img, 0, 0)
	var image = ctx.getImageData(0,0, img.width, img.height)
	for (var i=0; i<image.data.length; i+=4) {
		data[i>>2] = image.data[i][0]>=128 ? 1 : 0
	}
	bank[b] = {data:data, width:img.width, height:img.height}
	console.log('load_bank', b, bank[b])
	
}

function wait_for_banks() {
	while (load_cnt != done_cnt) {
	}
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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
