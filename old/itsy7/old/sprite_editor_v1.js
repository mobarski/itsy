// TODO - config/fc definition in separate file
PAL = palette['pico8']
SPW = 5
SPH = 5
SHW = 7
SHH = 7
SHS = 5
SHM = 1
EDS = 40

function _init_old() {
	//cnv.style.cursor = "none"
	s = sprite(3,3,[0,0,1],[
		0,1,0,
		1,2,1,
		1,0,1],8,12,alpha={0:0,2:128})

	cls(0,0,0)
	spr(s,100,100,45)
	spr(s,110,110)
	for (i=0;i<16;i++) {
		rect(30+i*40,50,30,30,i)
	}
}

function _init() {
	cls(0,0,0)
	sheet_data = []
	for (var i=0; i<SHW*SHH; i++) {
		var pixel_data = new Array(SPW*SPH)
		for (j=0;j<pixel_data.length;j++) {pixel_data[j]=i%PAL.length}
		sheet_data.push(pixel_data)
	}
	editor = new Editor(24,100,SPW,SPH,EDS,EDS)
	picker = new Picker(24,24,30,30,8)
	sheet = new Sheet(400,100,SPW,SPH,SHS,SHS,SHW,SHH,SHM,sheet_data)
	toolbox = new Toolbox(24,450,8,2,16,16,null)
}

function _main() {
	keyboard_before_main()
	
	var [mx,my,m1] = mouse()
	//aux = pix(mx,my)
	aux = key('a')
	//status(`x:${MX} y:${MY} m1:${M1} m2:${M2} mw:${MW} ${aux}`)

	cls(0,0,0)
	
	sheet.main()
	picker.main()
	editor.active_color = picker.active_color
	editor.background_color = picker.background_color
	editor.main(sheet_data[sheet.active_sprite])
	toolbox.main()
	
	keyboard_after_main()
}

function Picker(x,y,sx,sy,m) {
	this.marker_color = 6
	this.active_color = 0
	this.background_color = 0
	this.main = function() {
		// draw
		var c = this.active_color
		var b = this.background_color
		rect(x+c*(sx+m),y-16,sx,8,this.marker_color)
		rect(x+b*(sx+m),y+sy+16-8,sx,8,this.marker_color)
		for (var i=0;i<PAL.length;i++) {
			rect(x+i*(sx+m),y,sx,sy,i)
		}
		
		// react
		// TODO refactor with _grid_click
		var [mx,my,m1,m2] = mouse()
		if (m1 && my>=y && my<=y+sy && mx>=x && mx<=x+(sx+m)*PAL.length) {
			this.active_color = Math.floor((mx-x) / (sx+m))
		}
		if (m2 && my>=y && my<=y+sy && mx>=x && mx<=x+(sx+m)*PAL.length) {
			this.background_color = Math.floor((mx-x) / (sx+m))
		}
	}
}

// GET 
function _grid_click(x,y,w,h,sx,sy) {
	var [mx,my,m1,m2] = mouse()
	var i=null
	var j=null
	var mb=0
	if (my>=y && my<=y+sy*h && mx>=x && mx<=x+sx*w) {
		if (m1 || m2) {
			if (m1) mb=1
			if (m2) mb=2
			i = Math.floor((mx-x) / sx)
			j = Math.floor((my-y) / sy)
			status(`mx-x:${mx-x} my-y:${my-y} i:${i} j:${j} m1:${m1} m2:${m2} mb:${mb}`)
		}
	}
	return [i,j,mb]
}

function Editor(x,y,w,h,sx,sy) {
	this.active_color = 1
	this.background_color = 0
	this.margin = 4
	this.data = null
	this.main = function(data) {
		this.data = data
		
		// draw
		var m=this.margin
		rect(x-m,y-m,w*sx+2*m,h*sy+2*m,1)
		_spr(data,x,y,w,h,sx,sy)
	
		// react
		var [i,j,mb] = _grid_click(x,y,w,h,sx,sy)
		if (mb==1) data[i+j*w] = this.active_color
		if (mb==2) data[i+j*w] = this.background_color
	}
}

function Sheet(x,y,w,h,sx,sy,sw,sh,m,data) {
	this.active_sprite = 0
	this.data = data
	this.main = function() {
		// draw
		for (var i=0; i<sh; i++) {
			for (var j=0; j<sw; j++) {
				var k = j+i*sw
				_spr(this.data[k],x+j*sx*(w+m),y+i*sy*(h+m),w,h,sx,sy)
			}
		}

		// react
		var [i,j] = _grid_click(x,y,sw,sh,sx*(w+m),sy*(h+m))
		if (i != null) {
			this.active_sprite = j*sw+i
		}
	}
	this.save = function(key) {
		save(key, sheet_data)
		tar.value = dumps(sheet_data)
	}
	this.load = function(key) {
		var v = load(key)
		for (var i=0; i<v.length; i++) {
			sheet_data[i] = v[i]
		}
	}
}

function Toolbox(x,y,w,h,sx,sy,icons) {
	this.buffer = null
	this.main = function() {
		// draw
		for (var i=0; i<w; i++) {
			for (var j=0; j<h; j++) {
				rect(x+i*sx,y+j*sy,sx,sy,(i+j*w)%PAL.length)
			}
		}
		
		// react
		var [i,j] = _grid_click(x,y,w,h,sx,sy)
		switch (`${i},${j}`) {
			case '0,0': clear_sprite(editor.data,picker.background_color); break
			case '1,0': copy_sprite(editor.data); break
			case '2,0': paste_sprite(editor.data); break
			case '3,0': shift_sprite(editor.data,-1); break
			case '4,0': shift_sprite(editor.data,1); break
			case '5,0': shift_sprite(editor.data,-SPW); break
			case '6,0': shift_sprite(editor.data,SPW); break
			case '7,0': flip_sprite_horiz(editor.data,SPW,SPH); break
			case '0,1': flip_sprite_vert(editor.data,SPW,SPH); break
			case '1,1': mirror_sprite_down_to_up(editor.data,SPW,SPH); break
			case '2,1': mirror_sprite_up_to_down(editor.data,SPW,SPH); break
			case '3,1': mirror_sprite_left_to_right(editor.data,SPW,SPH); break
			case '4,1': mirror_sprite_right_to_left(editor.data,SPW,SPH); break
			case '5,1': replace_color(editor.data,picker.active_color,picker.background_color); break
			case '6,1': sheet.save('maciek.test'); break
			case '7,1': sheet.load('maciek.test'); break
		}
	}
}

function swap_colors(data,c1,c2) {
	for (var i=0; i<data.length; i++) {
		switch (data[i]) {
			case c1:
				data[i]=c2
				break
			case c2:
				data[i]=c1
				break
		}
	}
}

function replace_color(data,c1,c2) {
	for (var i=0; i<data.length; i++) {
		switch (data[i]) {
			case c1:
				data[i]=c2
				break
		}
	}
}

function copy_sprite(data) {
	toolbox.buffer = data.slice()
}

function paste_sprite(data) {
	if (toolbox.buffer) {
		for (var i=0; i<data.length; i++) {
			data[i] = toolbox.buffer[i]
		}
	}
}

function shift_sprite(data,n) {
	var x
	var i
	if (n>0) {
		for (i=0;i<n;i++) {
			data.unshift(data.pop())
		}
	} else {
		for (i=n;i<0;i++) {
			data.push(data.shift())
		}
	}
}

function flip_sprite_horiz(data,w,h) {
	for (var j=0; j<h; j++) {
		for (var i=0; i<Math.floor(w/2); i++) {
			var c = data[j*w + w-i-1]
			data[j*w + w-i-1] = data[j*w + i]
			data[j*w + i] = c
		}
	}
}

function flip_sprite_vert(data,w,h) {
	for (var j=0; j<Math.floor(h/2); j++) {
		for (var i=0; i<w; i++) {
			var c = data[(h-j-1)*w + i]
			data[(h-j-1)*w + i] = data[j*w + i]
			data[j*w + i] = c
		}
	}
}

function mirror_sprite_up_to_down(data,w,h) {
	for (var j=0; j<Math.floor(h/2); j++) {
		for (var i=0; i<w; i++) {
			data[(h-j-1)*w + i] = data[j*w + i]
		}
	}
}

function mirror_sprite_down_to_up(data,w,h) {
	for (var j=0; j<Math.floor(h/2); j++) {
		for (var i=0; i<w; i++) {
			data[j*w + i] = data[(h-j-1)*w + i]
		}
	}
}

function mirror_sprite_left_to_right(data,w,h) {
	for (var j=0; j<h; j++) {
		for (var i=0; i<Math.floor(w/2); i++) {
			data[j*w + w-i-1] = data[j*w + i]
		}
	}
}

function mirror_sprite_right_to_left(data,w,h) {
	for (var j=0; j<h; j++) {
		for (var i=0; i<Math.floor(w/2); i++) {
			data[j*w + i] = data[j*w + w-i-1]
		}
	}
}

function clear_sprite(data,c) {
	data.fill(c)
}

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

window.onload = function(e) {
	_init()
	window.setInterval(_main,16.6)
}
