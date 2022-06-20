var out = document.getElementById("output")
var tar = document.getElementById("textarea")
var cnv = document.getElementById("main_canvas")
var ctx = cnv.getContext("2d")

// ----------------------------------------------------------------------------

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


function clear_screen(r,g,b) {
	ctx.fillStyle=`rgb(${r},${g},${b})`
	ctx.fillRect(0,0,cnv.width,cnv.height)
}

// TODO transparency separated from pal
function create_sprite(w,h,pal,pixels,sx=1,sy=1,alpha={0:0}) {
	var img = ctx.createImageData(w*sx,h*sy)
	for (var i=0;i<pixels.length;i+=1) {
		var c = pixels[i]
		var p = pal[c]
		var x = i % w
		var y = Math.floor(i / h)
		var ii = y*sy*sx*w + x*sx
		for (var iy=0; iy<sy; iy+=1) {
			for (var ix=0; ix<sx; ix+=1) {
				var iii = ii + iy*(sx*w) + ix
				img.data[4*iii + 0] = p[0]
				img.data[4*iii + 1] = p[1]
				img.data[4*iii + 2] = p[2]
				//img.data[4*iii + 3] = p.length>3 ? p[3] : 255
				img.data[4*iii + 3] = c in alpha ? alpha[c] : 255
			}
		}
	}
	return imagedata_to_image(img)
}

// TODO flip (translate(w,0) + scale(-1,1))
function draw_sprite(img,x,y,rot=0) {
	var w = img.width
	var h = img.height
	ctx.save()
	ctx.translate(x+w/2,y+h/2)
	ctx.rotate(rot * Math.PI / 180)
	ctx.drawImage(img,-w/2,-h/2)
	ctx.restore()	
}

function get_pixel_rgb(x,y) {
	return ctx.getImageData(x,y,1,1).data
}

function dumps(data) {
	return JSON.stringify(data)
}

function loads(s) {
	return JSON.parse(s)
}

// ---[ MOUSE ]-----------------------------------------------------------------

// IDEA - status -> 3210 3:down 2:held 1:up 0:none
// IDEA - status -> 210-1 2:down 1:held 0:none -1:up

var MX = -1
var MY = -1
var M1 = 0
var M2 = 0
var MW = 0

var cnv_bcr = cnv.getBoundingClientRect()

function on_mouse_move(e) {
	MX = e.clientX - cnv_bcr.left // TODO - cnv_x
	MY = e.clientY - cnv_bcr.top // TODO - cnv_y
}

function on_mouse_up(e) {
	if (e.button==0) {
		M1 = 0
	} else if (e.button==2) {
		M2 = 0
	}
}

function on_mouse_down(e) {
	if (e.button==0) {
		M1 = 1
	} else if (e.button==2) {
		M2 = 1
	}
}

function on_wheel(e) {
	if (e.deltaY > 0) {
		MW = 1
	} else if (e.deltaY < 0) {
		MW = -1
	} else {
		MW = 0
	}
}

document.addEventListener('mousemove',on_mouse_move)
cnv.addEventListener('mouseup',on_mouse_up)
cnv.addEventListener('mousedown',on_mouse_down)
cnv.addEventListener('wheel',on_wheel)
cnv.addEventListener("contextmenu",function(e){e.preventDefault()})

// === [ KEYBOARD ] ============================================================

var KEY = {} // 2:down 1:released
var KEYS = {}

function on_key_press(e) {
	var k = e.key
	if (KEY[k]==1 || KEY[k]==null) {
		KEY[k] = 3
	} else {
		KEY[k] = 2
	}
}

function on_key_up(e) {
	var k = e.key
	KEY[k] = 1
}

function keyboard_before_main() {
	KEYS = {}
	for (var k in KEY) {
		KEYS[k] = KEY[k]
	}
}

function keyboard_after_main() {
	for (var k in KEYS) {
		if (KEY[k]==1 && KEYS[k]==1) {
			delete KEY[k]
		}
	}
}

function key(k) {
	return KEYS[k] || 0
}

document.addEventListener('keypress',on_key_press)
document.addEventListener('keyup',on_key_up)

// === STAGE 1 === mozliwosc zrobienia edytora spritow

// TODO gotowe palety

// TODO ustalenie przezroczystosci koloru
// TODO przemapowanie kolorow

// TODO pobranie koloru pixela i zmapowanie go na kolor z palety
// TODO rysowanie prostokata

// TODO wczytywanie / zapisywanie wynikow (localStorage)
// TODO import / export wynikow (plik tekstowy)

// === STAGE 2 === eventy

// TODO funkcja glowna
// TODO klawisze
// TODO mysz
// TODO dotyk

// === STAGE 3 === mapy

// TODO new_map(w,h,tiles,plan) -> image
// TODO draw_map(map,x,y) // x,y -> center
// TODO map_xy(scr_x, scr_y) -> tile_number

// === STAGE 4 === inne

// TODO rysowanie pixela
// TODO rysowanie kola
// TODO rysowanie lini

// TODO print
// TODO wlasne czcionki

// TODO dzwieki

// ----------------------------------------------------------------------------

var PAL = []

function cls(c,g=-1,b=-1) {
	var rgb = g>=0 ? [c,g,b] : PAL[c]
	clear_screen(rgb[0],rgb[1],rgb[2])
}

function rect(x,y,w,h,c) {
	var [r,g,b] = PAL[c]
	ctx.fillStyle = `rgb(${r},${g},${b})` // OPTIMIZATION  OPPORTUNITY
	ctx.fillRect(x,y,w,h)
}

function box(cx,cy,w,h,c) {
	rect(cx-0.5*w,cy-0.5*h,w,h,c)
}

// TODO scale
// TODO flip
// TODO n zamiast img
function spr(img,x,y,rot=0) {
	draw_sprite(img,x,y,rot)
}

// draw sprite directly from data
function _spr(data,x,y,w,h,sx,sy) {
	for (var i=0; i<w; i++) {
		for (var j=0; j<h; j++) {
			var c = data[i+j*w]
			rect(x+i*sx,y+j*sy,sx,sy,c)
		}
	}
}

// shadow(sp[1],0,4,x,y)
function _shd(data,bg,fg,x,y,w,h,sx,sy) {
}

function mouse() {
	return [MX,MY,M1,M2]
}

function pix(x,y) {
	var [r,g,b,a] = get_pixel_rgb(x,y)
	for (var i=0; i<PAL.length; i++) {
		if (PAL[i][0]==r && PAL[i][1]==g && PAL[i][2]==b) {
			return i
		}
	}
	return null
}

function sprite(w,h,colors,pixels,sx=1,sy=1,alpha={0:0}) {
	var pal = []
	for (i=0;i<colors.length;i++) {
		pal.push(PAL[colors[i]])
	}
	return create_sprite(w,h,pal,pixels,sx,sy,alpha)
}

function rnd(lo,hi) {
	return Math.floor((Math.random() * (hi-lo)) + lo)
}

function status(text) {
	out.innerHTML = text
}

function save(key,value) {
	localStorage['itsy_'+key] = JSON.stringify(value)
}

function load(key) {
	return JSON.parse(localStorage['itsy_'+key])
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

