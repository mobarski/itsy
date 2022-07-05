fc={}
async function run(boot,update,draw){fc.boot=boot||async function(){}
fc.update=update||function(){}
fc.draw=draw||function(){}
fc.skip_draw=false
fc.update_cnt=0
fc.draw_cnt=0
fc.main_cnt=0
fc.main_total_ms=0
fc.t0=time()
await fc.boot()
fc.target_dt=1000/fc.fps
fc.interval_id=setInterval(main_iter,fc.target_dt)}
function halt(){clearInterval(fc.interval_id)
fc.interval_id=0}
function resume(){if(fc.interval_id){return}
fc.interval_id=setInterval(main_iter,fc.target_dt)}
function time(){return new Date().valueOf()-(fc.t0||0)}
function main_iter(){let t0=time()
if(fc.has_mouse){proc_mouse()}
fc.update_cnt+=1
fc.update()
if(!fc.skip_draw){fc.draw_cnt+=1
fc.draw()
flip()}
fc.skip_draw=false
fc.main_total_ms+=time()-t0}
int=parseInt
floor=Math.floor
ceil=Math.ceil
abs=Math.abs
min=Math.min
max=Math.max
function mid(a,b,c){if(((a>b)&&(a<c))||((a>c)&&(a<b)))return a
if(((b>a)&&(b<c))||((b>c)&&(b<a)))return b
return c}
function rnd(a,b){return int(a)+int(Math.random()*(int(b)-int(a)+1))}
sin=Math.sin
cos=Math.cos
atan2=Math.atan2
PI=Math.PI
sqrt=Math.sqrt
fc.colors=["#1a1c2c","#5d275d","#b13e53","#ef7d57","#ffcd75","#a7f070","#38b764","#257179","#29366f","#3b5dc9","#41a6f6","#73eff7","#f4f4f4","#94b0c2","#566c86","#333c57"]
function init(width,height,scale=1,fps=30,colors,div_id='screen'){let screen=document.getElementById(div_id)
screen.innerHTML=`<canvas id="main_canvas" width="${width*scale}" height="${height*scale}""></canvas>`
fc.cnv=document.getElementById("main_canvas")
fc.ctx=fc.cnv.getContext("2d")
fc.ctx.webkitImageSmoothingEnabled=false
fc.ctx.msImageSmoothingEnabled=false
fc.ctx.imageSmoothingEnabled=false
fc.framebuffer=new ImageData(width,height)
fc.cnv_fb=document.createElement('canvas');fc.cnv_fb.width=width;fc.cnv_fb.height=height;fc.ctx_fb=fc.cnv_fb.getContext('2d');fc.ctx.scale(scale,scale)
fc.scale=scale
fc.width=width
fc.height=height
fc.fps=fps
fc.camera_x=0
fc.camera_y=0
fc.color=1
if(colors){fc.colors=colors}
pal()
fc.rgb={}
for(let i=0;i<fc.colors.length;i++){let r=parseInt(fc.colors[i].substr(1,2),16)
let g=parseInt(fc.colors[i].substr(3,2),16)
let b=parseInt(fc.colors[i].substr(5,2),16)
fc.rgb[i]=[r,g,b]}
let data=fc.framebuffer.data
for(let i=3;i<data.length;i+=4){data[i]=255}
if(fc.has_mouse){init_mouse()}
if(fc.has_sound){init_sound()}}
function camera(x,y){fc.camera_x=x
fc.camera_y=y
fc.ctx.setTransform(1,0,0,1,x*fc.scale,y*fc.scale)}
function cls(col){rect(0,0,fc.cnv.width,fc.cnv.height,col)}
function color(col){if(col==undefined){return fc.color}
let prev_col=fc.color
fc.color=int(col)
c=fc.draw_pal[fc.color]
fc.ctx.fillStyle=fc.colors[c]
fc.ctx.strokeStyle=fc.ctx.fillStyle
return prev_col}
function line(x0,y0,x1,y1,col){if(x0==x1){return rect(x0,min(y0,y1),1,abs(y1-y0),col)}
if(y0==y1){return rect(min(x0,x1),y0,abs(x1-x0),1,col)}
let dx=Math.abs(x1-x0)
let sx=x0<x1?1:-1
let dy=-Math.abs(y1-y0)
let sy=y0<y1?1:-1
let error=dx+dy
let e2
for(;;){rect(x0,y0,1,1,col)
if((x0==x1)&&(y0==y1)){break}
e2=2*error
if(e2>=dy){if(x0==x1){break}
error+=dy
x0+=sx}
if(e2<=dx){if(y0==y1){break}
error+=dx
y0+=sy}}}
function pal(col1,col2){if(col1>=0){col1=int(col1)
col2=int(col2)
let prev_col=fc.draw_pal[col1]
fc.draw_pal[col1]=col2
return prev_col}else{fc.draw_pal=[]
for(let i=0;i<fc.colors.length;i++){fc.draw_pal.push(i)}}}
function fullscreen(){let elem=fc.cnv
if(elem.requestFullscreen){elem.requestFullscreen()}else if(elem.mozRequestFullScreen){elem.mozRequestFullScreen()}else if(elem.webkitRequestFullscreen){elem.webkitRequestFullscreen()}else if(elem.msRequestFullscreen){elem.msRequestFullscreen()}}
function rect(x,y,w,h,col){if(col<0){return}
if(col==undefined){col=fc.color}
let c=fc.draw_pal[int(col)]
if(c<0){return}
if(!(c in fc.rgb)){console.log('invalid color col:',col,'c:',c)}
let rgb=fc.rgb[c]
let r=rgb[0]
let g=rgb[1]
let b=rgb[2]
let data=fc.framebuffer.data
if((x+w<0)||(y+h<0)){return}
if((x>fc.width)||(y>fc.height)){return}
if(x<0){w+=x
x=0}
if(y<0){h+=y
y=0}
w=min(w,fc.width-x)
h=min(h,fc.height-y)
for(let i=0;i<h;i++){let row_offset=(y+i)*4*fc.width
for(let j=(x+0)*4+row_offset;j<(x+w)*4+row_offset;j+=4){data[j+0]=r
data[j+1]=g
data[j+2]=b
}}}
function flip(){fc.ctx_fb.putImageData(fc.framebuffer,0,0)
fc.ctx.drawImage(fc.cnv_fb,0,0)}
fc.has_mouse=true
function mouse(){return[fc.mouse_x,fc.mouse_y,fc.mouse_btn[1],fc.mouse_btn[2]]}
function set_mouse_xy(e){let bcr=fc.cnv.getBoundingClientRect()
let ratio=bcr.height/fc.height
let bcr_top=bcr.top
let bcr_left=ratio==fc.scale?bcr.left:0.5*(bcr.width-fc.width*ratio)
let mx=e.clientX-bcr_left
let my=e.clientY-bcr_top
fc.mouse_x=parseInt(mx/ratio)-fc.camera_x
fc.mouse_y=parseInt(my/ratio)-fc.camera_y
}
function on_mouse_move(e){set_mouse_xy(e)
}
function on_mouse_down(e){fc.xxx_ts=time()
set_mouse_xy(e)
fc.mouse_btn_queue.push(e.buttons)
}
function on_mouse_up(e){set_mouse_xy(e)
fc.mouse_btn_queue.push(e.buttons)
}
function on_wheel(e){e.preventDefault()
set_mouse_xy(e)
let dx=e.deltaX
let dy=e.deltaY
console.log('mouse_wheel',fc.mouse_x,fc.mouse_y,dx,dy,e)}
function on_touch_start(e){e.preventDefault()
set_touch_xy(e)
fc.mouse_btn_queue.push(1)}
function on_touch_move(e){e.preventDefault()
set_touch_xy(e)
fc.mouse_btn_queue.push(1)}
function on_touch_end(e){e.preventDefault()
set_touch_xy(e)
fc.mouse_btn_queue.push(0)}
function set_touch_xy(e){let bcr=fc.cnv.getBoundingClientRect()
let ratio=fc.scale
let mx=e.targetTouches[0].pageX
let my=e.targetTouches[0].pageY
fc.mouse_x=parseInt(mx/ratio)
fc.mouse_y=parseInt(my/ratio)}
function init_mouse(){fc.mouse_x=-1
fc.mouse_y=-1
fc.mouse_btn={1:0,2:0,3:0}
fc.mouse_buttons=0
fc.mouse_btn_queue=[]
document.addEventListener('mousemove',on_mouse_move)
document.addEventListener('mouseup',on_mouse_up)
document.addEventListener('mousedown',on_mouse_down)
document.addEventListener('wheel',on_wheel)
fc.cnv.addEventListener('touchstart',on_touch_start)
fc.cnv.addEventListener('touchmove',on_touch_move)
fc.cnv.addEventListener('touchend',on_touch_end)
fc.cnv.addEventListener('contextmenu',function(e){e.preventDefault()})}
function proc_mouse(){for(let j in[1,2,3]){if(fc.mouse_btn[j]==3){fc.mouse_btn[j]=2}
if(fc.mouse_btn[j]==1){fc.mouse_btn[j]=0}
if(fc.mouse_btn[j]==2){fc.mouse_btn[j]=fc.mouse_buttons&(1<<(j-1))?2:1}}
let pressed={1:0,2:0,3:0}
let released={1:0,2:0,3:0}
let prev=fc.mouse_buttons
let cnt=fc.mouse_btn_queue.length
if(cnt==0){return}
for(let i=0;i<cnt;i++){let b=fc.mouse_btn_queue.shift()
for(let j in[1,2,3]){let mask=1<<(j-1)
if((b&mask)!=(prev&mask)){if(b&mask){pressed[j]=1}else{released[j]=1}}}
prev=b}
for(let j in[1,2,3]){if(pressed[j]){fc.mouse_btn[j]=3}
else if(released[j]){fc.mouse_btn[j]=1}}
fc.mouse_buttons=prev}
fc.has_sound=true
fc.freq={}
fc.audio=new AudioContext()
fc.ch={}
function channel(c,type='square',bpm=120,attack=0.1,release=0.3,volume=1.0,exp_attack=0,exp_release=0,detune=0,delay=0){let vol=fc.audio.createGain()
vol.connect(fc.audio.destination)
vol.gain.setValueAtTime(0.00001,fc.audio.currentTime)
let osc
if(type=='noise'){let samples=22050
let buf=fc.audio.createBuffer(2,samples,22050);for(let i=0;i<2;i++){let data=buf.getChannelData(i)
for(let j=0;j<buf.length;j++){data[j]=Math.random()*2-1}}
osc=fc.audio.createBufferSource()
osc.buffer=buf
osc.loop=true}else{osc=fc.audio.createOscillator()
osc.type=type}
osc.detune=detune
osc.connect(vol)
osc.start(0)
fc.ch[c]={type:type,bpm:bpm,attack:attack,release:release,volume:volume,delay:delay,detune:detune,exp_attack:exp_attack,exp_release:exp_release,osc:osc,vol:vol}}
function snd(n,c=1,d=0){let t=60/fc.ch[c].bpm*Math.pow(2,d)/4
console.log('snd',n,c,d,t)
if(!(n in fc.freq)){return}
if(!(c in fc.ch)){return}
let ch=fc.ch[c]
ch.vol.gain.cancelScheduledValues(fc.audio.currentTime)
ch.vol.gain.exponentialRampToValueAtTime(0.0001,fc.audio.currentTime)
if(ch.type=='noise'){ch.osc.playbackRate.setValueAtTime(fc.freq[n]/440,fc.audio.currentTime)}else{ch.osc.frequency.setValueAtTime(fc.freq[n],fc.audio.currentTime)}
let t_attack=fc.audio.currentTime+ch.delay+ch.attack
let t_sustain=fc.audio.currentTime+ch.delay+t
let t_release=fc.audio.currentTime+ch.delay+t+ch.release
if(ch.exp_attack){ch.vol.gain.exponentialRampToValueAtTime(ch.volume,t_attack)}else{ch.vol.gain.linearRampToValueAtTime(ch.volume,t_attack)}
ch.vol.gain.setValueAtTime(ch.volume,t_sustain)
if(ch.exp_release){ch.vol.gain.exponentialRampToValueAtTime(0.00001,t_release)}else{ch.vol.gain.linearRampToValueAtTime(0.00001,t_release)}}
function init_sound(){for(let i=0;i<128;i++){fc.freq[i]=440*Math.pow(2,(i-69)/12)}}
fc.font={}
function text(s,x,y,font=0,col1,col0){let i_list=encode(s,font)
return str(i_list,x,y,font,col1,col0)}
function chr(i,x,y,font=0,col1,col0){let w=fc.font[font].w
let h=fc.font[font].h
if(!i){return[w,h]}
if((x+w<0)||(x>fc.width)){return[w,h]}
if((y+h<0)||(y>fc.height)){return[w,h]}
let font_width=fc.font[font].width
let n_cols=parseInt(font_width/w)
let u=w*(i%n_cols)
let v=h*parseInt(i/n_cols)
blit(x,y,u,v,w,h,font,col1,col0)
return[w,h]}
function encode(s,font=0){let i_list=[]
let charmap=fc.font[font].charmap||{}
for(let j=0;j<s.length;j++){let i=charmap[s[j]]||0
i_list.push(i)}
return i_list}
function str(i_list,x,y,font=0,col1,col0){let w=fc.font[font].w
let h=fc.font[font].h
for(let i=0;i<i_list.length;i++){chr(i_list[i],x+i*w,y,font,col1,col0)}
return[w*i_list.length,h]}
function blit_v1(x,y,u,v,w,h,font,c1,c0=-1){let b=fc.font[font]
for(let i=0;i<h;i++){for(let j=0;j<w;j++){let pos=(u+j)+(v+i)*b.width
let mask=1<<(u+j)%8
if(b.data[pos>>3]&mask){if((c1==undefined)||(c1>=0)){rect(x+j,y+i,1,1,c1)}}else{if(c0>=0){rect(x+j,y+i,1,1,c0)}}}}}
function blit_v2(x,y,u,v,w,h,font,c1,c0=-1){let b=fc.font[font]
for(let i=0;i<h;i++){for(let j=0;j<w;j++){let pos=((u+j)+(v+i)*b.width)>>3
let mask=1<<(u+j)%8
if((mask<=128)&&(j<w-1)&&(b.data[pos]&mask)&&(b.data[pos]&(mask<<1))){rect(x+j,y+i,2,1,c1)
j+=1}
else if(b.data[pos]&mask){rect(x+j,y+i,1,1,c1)}else{rect(x+j,y+i,1,1,c0)}}}}
function blit_v3(x,y,u,v,w,h,font,c1,c0=-1){let b=fc.font[font]
for(let i=0;i<h;i++){for(let j=0;j<w;j++){let pos=((u+j)+(v+i)*b.width)>>3
let mask=1<<(u+j)%8
let m=1
let k=0
if(b.data[pos]&mask){for(k=0;k<8-(u+j)%8;k++){if(!(b.data[pos]&(mask<<(k+1)))){break}}
rect(x+j,y+i,(k+1),1,c1)
j+=k}else{for(k=0;k<8-(u+j)%8;k++){if((b.data[pos]&(mask<<(k+1)))){break}}
rect(x+j,y+i,(k+1),1,c0)
j+=k}}}}
blit=blit_v3
fc.font[0]={"data":[0,24,62,60,30,126,126,60,102,60,120,102,6,198,102,60,0,60,102,102,54,6,6,102,102,24,48,54,6,238,110,102,0,102,102,6,102,6,6,6,102,24,48,30,6,254,126,102,0,126,62,6,102,30,30,118,126,24,48,14,6,214,126,102,0,102,102,6,102,6,6,102,102,24,48,30,6,198,118,102,0,102,102,102,54,6,6,102,102,24,54,54,6,198,102,102,0,102,62,60,30,126,6,60,102,60,28,102,126,198,102,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,60,62,60,126,102,102,198,102,102,126,60,60,48,12,48,102,102,102,102,24,102,102,198,102,102,96,12,48,8,16,72,102,102,102,6,24,102,102,198,60,102,48,12,48,8,16,12,62,102,62,60,24,102,102,214,24,60,24,12,48,6,96,62,6,102,30,96,24,102,102,254,60,24,12,12,48,8,16,12,6,60,54,102,24,102,60,238,102,24,6,12,48,8,16,70,6,112,102,60,24,60,24,198,102,24,126,60,60,48,12,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,6,0,96,0,112,0,6,24,96,6,28,0,0,0,102,60,6,60,96,60,24,124,6,0,0,6,24,102,62,60,0,96,62,6,124,102,124,102,62,28,96,54,24,254,102,102,0,124,102,6,102,126,24,102,102,24,96,30,24,254,102,102,0,102,102,6,102,6,24,124,102,24,96,54,24,214,102,102,0,124,62,60,124,60,24,96,102,60,96,102,60,198,102,60,0,0,0,0,0,0,0,62,0,0,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,24,16,108,0,0,0,0,0,24,0,0,0,0,0,0,56,24,56,254,0,62,124,62,124,126,102,102,198,102,102,126,124,102,124,254,192,102,102,102,6,24,102,102,214,60,102,48,254,102,254,254,124,102,102,6,60,24,102,102,254,24,102,24,254,24,124,124,110,62,124,6,96,24,102,60,124,60,124,12,56,24,56,56,108,6,96,6,62,112,124,24,108,102,48,126,124,60,16,16,108,6,96,0,0,0,0,0,0,0,30,0,0,0,0,0,0,24,60,60,96,126,60,126,60,60,60,0,0,0,0,0,0,24,102,102,112,6,102,102,102,102,102,0,0,0,24,0,0,28,96,96,120,62,6,48,102,102,118,0,126,0,24,24,24,24,48,56,102,96,62,24,60,124,110,126,0,0,126,0,0,24,12,96,254,96,102,24,102,96,102,0,126,0,24,0,0,24,6,102,96,102,102,24,102,102,102,0,0,0,24,24,24,126,126,60,96,60,60,24,60,60,60,0,0,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,12,24,60,102,24,70,16,60,0,48,12,112,0,14,0,0,60,24,102,102,124,102,56,102,102,24,24,24,192,24,0,0,102,24,118,255,6,48,108,60,60,12,48,12,96,48,0,0,96,24,118,102,60,24,198,28,255,12,48,6,48,96,0,0,48,0,6,255,96,12,0,230,60,12,48,12,24,48,0,0,24,0,70,102,62,102,0,102,102,24,24,24,12,24,24,24,0,24,60,102,24,98,0,252,0,48,12,112,6,14,24,24,24,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,0,0,0,224,255,7,0,0,0,0,0,0,0,3,0,192,0,0,0,248,255,31,0,0,0,0,248,255,31,3,0,192,224,255,7,28,0,56,224,240,7,255,248,255,31,3,0,192,240,255,15,12,0,48,240,240,15,255,24,24,24,3,0,192,248,255,31,6,0,96,56,0,28,0,24,24,24,3,0,192,248,255,31,6,0,96,24,0,24,0,24,24,24,3,0,192,248,255,31,6,0,96,24,0,24,0,24,24,24,3,255,192,248,0,31,6,60,96,0,0,24,24,24,24,24,3,255,192,248,60,31,6,126,96,0,0,24,24,24,24,24,3,195,192,248,126,31,6,255,96,0,60,24,24,248,255,31,3,195,192,248,126,31,6,255,96,0,60,24,24,248,255,31,3,195,192,248,126,31,6,255,96,24,60,0,24,24,24,24,3,195,192,248,126,31,6,255,96,24,60,0,24,24,24,24,3,255,192,248,60,31,6,126,96,24,0,0,24,24,24,24,3,255,192,248,0,31,6,60,96,24,0,0,24,24,24,24,3,0,192,248,255,31,6,0,96,24,0,24,0,24,24,24,3,0,192,248,255,31,6,0,96,24,0,24,0,24,24,24,3,0,192,248,255,31,6,0,96,56,0,28,0,248,255,31,3,0,192,240,255,15,12,0,48,240,15,15,24,248,255,31,3,0,192,224,255,7,28,0,56,224,15,7,24,0,0,0,3,0,192,0,0,0,248,255,31,0,0,0,0,0,0,0,255,255,255,0,0,0,224,255,7,0,0,0,0,0,0,0,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,1,192,3,3,192,255,0,24,24,0,0,224,255,7,24,192,3,224,7,3,192,255,0,24,24,96,96,248,255,31,60,224,7,112,14,3,192,24,0,24,24,96,96,252,255,63,126,240,15,56,28,255,255,24,24,24,24,0,0,252,255,63,24,248,31,28,56,255,255,24,60,56,28,0,0,254,255,127,24,252,63,14,112,3,192,24,126,112,14,0,96,254,255,127,24,254,127,7,224,3,192,24,231,224,7,0,96,254,255,127,24,255,255,3,192,3,192,24,195,192,3,0,0,254,0,127,24,255,255,1,128,192,3,24,195,192,3,0,0,254,60,127,24,254,127,2,64,224,7,24,231,224,7,96,102,254,126,127,24,252,63,4,32,112,14,24,126,112,14,96,102,254,102,127,24,248,31,8,16,56,28,24,60,56,28,0,0,254,102,127,126,240,15,16,8,56,28,24,24,24,24,0,0,254,126,127,60,224,7,32,4,112,14,24,0,24,24,6,6,254,60,127,24,192,3,64,2,224,7,255,0,24,24,6,6,254,0,127,0,128,1,128,1,192,3,255,0,24,24,0,0,254,255,127,24,0,0,129,195,51,0,51,51,0,51,0,0,254,255,127,60,8,16,66,231,51,0,51,153,0,153,102,102,254,255,127,126,12,48,36,126,204,0,204,204,0,204,102,102,252,255,63,24,254,127,24,60,204,0,204,102,0,102,0,24,252,255,63,24,254,127,24,60,51,51,3,51,51,3,0,24,248,255,31,126,12,48,36,126,51,51,3,153,153,9,102,102,224,255,7,60,8,16,66,231,204,204,12,204,204,12,102,102,0,0,0,24,0,0,129,195,204,204,12,102,102,6,0,0,15,255,255,240,192,3,0,24,126,24,0,0,0,0,0,60,15,252,63,240,240,15,0,24,231,60,0,0,0,0,24,66,7,240,15,224,252,63,0,60,129,255,0,0,0,24,36,129,7,192,3,224,255,255,0,60,195,126,0,0,0,36,66,129,3,0,0,192,255,255,24,126,231,60,240,255,15,36,66,129,3,0,0,192,252,63,60,126,195,102,240,255,15,24,36,129,1,0,0,128,240,15,126,255,153,66,240,255,15,0,24,66,1,0,0,128,192,3,255,255,126,0,240,255,15,0,0,60,0,128,1,0,128,1,255,255,240,126,240,240,15,0,36,0,0,128,1,0,192,3,126,255,240,255,240,240,15,0,0,24,0,192,3,0,224,7,60,126,48,153,240,240,15,8,0,60,0,192,3,0,240,15,24,126,51,153,240,240,15,20,0,60,3,224,7,192,240,15,0,60,55,255,240,15,15,8,0,24,15,224,7,240,224,7,0,60,62,126,240,15,15,0,0,60,63,240,15,252,192,3,0,24,60,44,240,15,15,0,0,126,255,240,15,255,128,1,0,24,56,0,240,15,15,0,0,0,0,0,0,0,0,0,248,16,192,96,240,255,15,60,108,126,0,0,0,0,72,18,20,56,192,48,240,255,15,66,146,255,0,0,0,0,36,36,18,108,200,126,240,255,15,153,130,219,192,3,0,0,18,72,126,198,204,24,240,255,15,133,130,255,224,7,48,12,36,36,18,130,254,126,0,0,0,133,68,231,112,14,112,14,72,18,18,130,254,12,0,0,0,153,40,195,56,28,224,7,0,0,242,254,12,6,0,0,0,66,16,255,24,24,192,3,0,0,0,0,8,0,0,0,0,60,0,126,24,24,192,3,48,0,0,124,24,28,112,126,126,0,85,255,56,28,224,7,48,12,128,124,36,34,96,129,255,85,170,255,112,14,112,14,16,146,192,68,36,34,80,165,219,0,85,255,224,7,48,12,0,96,96,68,24,28,28,129,255,170,170,255,192,3,0,0,0,12,54,68,8,8,34,189,195,0,85,255,0,0,0,0,0,146,28,119,56,28,34,153,231,85,170,255,0,0,0,0,0,96,8,119,8,8,28,129,255,0,85,255,0,0,0,0,0,0,0,0,56,0,0,126,126,170,170,255],"width":128,"height":128,"charmap":{"A":1,"B":2,"C":3,"D":4,"E":5,"F":6,"G":7,"H":8,"I":9,"J":10,"K":11,"L":12,"M":13,"N":14,"O":15,"P":16,"Q":17,"R":18,"S":19,"T":20,"U":21,"V":22,"W":23,"X":24,"Y":25,"Z":26,"[":27,"]":28,"{":29,"}":30,"\"":32,"a":33,"b":34,"c":35,"d":36,"e":37,"f":38,"g":39,"h":40,"i":41,"j":42,"k":43,"l":44,"m":45,"n":46,"o":47,"p":48,"q":49,"r":50,"s":51,"t":52,"u":53,"v":54,"w":55,"x":56,"y":57,"z":58,"1":64,"2":65,"3":66,"4":67,"5":68,"6":69,"7":70,"8":71,"9":72,"0":73,"-":74,"=":75,"_":76,"+":77,":":78,";":79,"!":80,"@":81,"#":82,"$":83,"%":84,"^":85,"&":86,"*":87,"(":88,")":89,"<":90,"/":91,">":92,",":93,".":94,"?":95,"`":243,"'":244},"rows":16,"cols":16,"w":8,"h":8}
