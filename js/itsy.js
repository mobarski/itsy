// ===[ screen.js ]=================


// TODO: object (fc? scr?)
// TODO: color arg -> optional? remove?

function init(width, height, fps) {
	var screen = document.getElementById("screen")
	screen.innerHTML = `<canvas id="main_canvas" width="${width}" height="${height}""></canvas>`
	
	out = document.getElementById("output")
	cnv = document.getElementById("main_canvas")
	
	ctx = cnv.getContext("2d")
	ctx.imageSmoothingEnabled = false
}

// TODO: argument to init
colors = [
	// https://lospec.com/palette-list/sweetie-16
	"#1a1c2c","#5d275d","#b13e53","#ef7d57",
	"#ffcd75","#a7f070","#38b764","#257179",
	"#29366f","#3b5dc9","#41a6f6","#73eff7",
	"#f4f4f4","#94b0c2","#566c86","#333c57"
]
// TODO: automatic
draw_pal = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

bank = {0:null, 1:null}

function camera(x, y) {
	ctx.setTransform(1,0,0,1,x,y)
}

function cls(col) {
	rect(0,0, cnv.width, cnv.height, col)
}

function color(col) {
	if (col == undefined) { return }
	c = draw_pal[col]
	ctx.fillStyle = colors[c]
	ctx.strokeStyle = ctx.fillStyle
}

function pal(col1, col2) {
	// TODO: reset <- col1==col2==-1
	draw_pal[col1] = col2
}

function rect(x, y, w, h, col) {
	color(col)
	ctx.fillRect(x,y,w,h)
}

function tri(x1, y1, x2, y2, x3, y3, col) {
	color(col)
	// TODO: propper width, edges, etc
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.lineTo(x3, y3)
	ctx.lineTo(x1, y1)
	ctx.closePath()
	ctx.fill()
}

function blit(x, y, bnk, u, v, w, h, colkey) {
	// TODO: experimental
	img = ctx.getImageData(x,y,w,h)
	var b = bank[bnk]
	console.log(bank)
	for (var i=0; i<h; i++) {
		for (var j=0; j<w; j++) {
			var k = i*j*4
			if (b.data[(u+j)+(v+i)*b.width]>0) {
				img.data[k+0] = 255
				img.data[k+1] = 0
				img.data[k+2] = 0
			}
		}
	}
	ctx.putImageData(img, x, y)
}


function set_bank(b, data, width) {
	bank[b] = {data:data, width:width, height:data.length/width}
}

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

function load_bank(b, path) {
	// TODO
	//var img = await _load_image(path)
		
	var c = document.createElement('canvas')
	var cc = c.getContext('2d')
	
	//cc.drawImage(img, 0, 0)
	var img = new Image()
	img.onload = function() {
		ctx.drawImage(img, 0, 0)
		var data = new Uint8Array(img.width * img.height)
		var image = ctx.getImageData(0, 0, img.width, img.height)
		for (var i=0; i<image.data.length; i+=4) {
			data[i>>2] = image.data[0]>=128 ? 1 : 0
		}
		bank[b] = {data:data, width:img.width, height:img.height}
		console.log('load_bank',b,bank[b].data) // XXX
	}
	img.crossOrigin = "anonymous"
	img.src = path
}

function _fullscreen() {
	var elem = cnv
	if (elem.requestFullscreen) {
		elem.requestFullscreen()
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen()
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen()
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen()
	}
}


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

// ===[ input.js ]=================

// TODO: mouse - x,y,button1
// TODO: left,right,up,down A B
// TODO: start / select

// ===[ sound.js ]=================

// TODO: use howler.js


