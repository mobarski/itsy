var out = document.getElementById("output")
var c = document.getElementById("main_canvas")
var ctx = c.getContext("2d")

ctx.font = "16px System"
ctx.fillText("Hello",20,20)
ctx.fillText("World",20,36)

function cls(r,g,b) {
	var img = ctx.getImageData(0,0,c.width,c.height)
	for (i=0;i<img.data.length;i+=4) {
		img.data[i+0] = r
		img.data[i+1] = g
		img.data[i+2] = b
		img.data[i+3] = 255
	}
	ctx.putImageData(img,0,0)
}
cls(0,255,0)

function sprite11(w,h,pal,pixels) {
	var img = ctx.createImageData(w,h)
	for (i=0;i<pixels.length;i+=1) {
		var p = pal[pixels[i]]
		img.data[4*i + 0] = p[0]
		img.data[4*i + 1] = p[1]
		img.data[4*i + 2] = p[2]
		img.data[4*i + 3] = p[3]
	}
	return img
}

function sprite(w,h,pal,pixels,sx=1,sy=1) {
	var img = ctx.createImageData(w*sx,h*sy)
	for (var i=0;i<pixels.length;i+=1) {
		var p = pal[pixels[i]]
		var x = i % w
		var y = Math.floor(i / h)
		var ii = y*sy*sx*w + x*sx
		for (var iy=0; iy<sy; iy+=1) {
			for (var ix=0; ix<sx; ix+=1) {
				var iii = ii + iy*(sx*w) + ix
				img.data[4*iii + 0] = p[0]
				img.data[4*iii + 1] = p[1]
				img.data[4*iii + 2] = p[2]
				img.data[4*iii + 3] = p[3]
			}
		}
	}
	return img
}

function put_sprite(s,x,y) {
	var w = s.width
	var h = s.height
	var img = ctx.getImageData(x,y,w,h)
	for (var i=0;i<img.data.length; i+=4) {
		if (s.data[i+3]>0) {
			img.data[i+0] = s.data[i+0]
			img.data[i+1] = s.data[i+1]
			img.data[i+2] = s.data[i+2]
			img.data[i+3] = s.data[i+3]
		}
	}
	ctx.putImageData(img,x,y)
}

function imagedata_to_image(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}


var pal = {0:[0,0,0,0],1:[0,0,0,255]}
var s1 = sprite11(3,3,pal,[
	1,1,1,
	0,1,0,
	1,1,1])
ctx.putImageData(s1,100,100)
var s2 = sprite(3,3,pal,[
	1,0,1,
	0,1,0,
	1,1,1],8,8)
put_sprite(s2,100,200)

cls(0,0,255)
img = imagedata_to_image(s2)
ctx.drawImage(img,100,300)
