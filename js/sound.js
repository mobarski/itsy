// !!! SANDBOX !!!

var context = new AudioContext()
var osc = context.createOscillator()
var vol = context.createGain()
vol.connect(context.destination)

osc.type = 'square'
//osc.type = 'sine'
osc.connect(vol)
function sound(f,t) {
	//vol.gain.exponentialRampToValueAtTime(1.0, 0.3) // fade in
	vol.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + t) // fade out
	osc.frequency.value = f
	//osc.frequency.setValueAtTime(0, context.currentTime + t*0.3)
	//osc.frequency.setValueAtTime(f*4, context.currentTime + t*0.8)
	osc.start(0)
	osc.stop(context.currentTime + t)
}
sound(220, 0.4)


// REF: https://bashooka.com/coding/web-audio-javascript-libraries/
// REF: http://bit101.github.io/tones/
// REF: https://stackoverflow.com/questions/6343450/generating-sound-on-the-fly-with-javascript-html5
// REF: https://marcgg.com/blog/2016/11/01/javascript-audio/
// TODO: use howler.js ???


