// !!! SANDBOX !!!

// REF: https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies

// key - piano key number
fc.freq = {
	88:4186.01, // C8
	87:3951.07,
	86:3729.31,
	85:3520.00,
	84:3322.44,
	83:3135.96,
	82:2959.96,
	81:2793.83,
	80:2637.02,
	79:2489.02,
	78:2349.32,
	77:2217.46,
	76:2093.00, // C7
	75:1975.53,
	74:1864.66,
	73:1760.00,
	72:1661.22,
	71:1567.98,
	70:1479.98,
	69:1396.91,
	68:1318.51,
	67:1244.51,
	66:1174.66,
	65:1108.73,
	64:1046.50, // C6
	63:987.77,
	62:932.33,
	61:880.00,
	60:830.61,
	59:783.99,
	58:739.99,
	57:698.46,
	56:659.26,
	55:622.25,
	54:587.33,
	53:554.37,
	52:523.25, // C5
	51:493.88,
	50:466.16,
	49:440.00,
	48:415.30,
	47:392.00,
	46:369.99,
	45:349.23,
	44:329.63,
	43:311.13,
	42:293.66,
	41:277.18,
	40:261.63, // C4
	39:246.94,
	38:233.08,
	37:220.00,
	36:207.65,
	35:196.00,
	34:185.00,
	33:174.61,
	32:164.81,
	31:155.56,
	30:146.83,
	29:138.59,
	28:130.81, // C3
	27:123.47,
	26:116.54,
	25:110.00,
	24:103.83,
	23:98.00,
	22:92.50,
	21:87.31,
	20:82.41,
	19:77.78,
	18:73.42,
	17:69.30,
	16:65.41, // C2
	15:61.74,
	14:58.27,
	13:55.00,
	12:51.91,
	11:49.00,
	10:46.25,
	9:43.65,
	8:41.20,
	7:38.89,
	6:36.71,
	5:34.65,
	4:32.70, // C1
	3:30.87,
	2:29.14,
	1:27.50  // A0
}

fc.audio = new AudioContext()
fc.ch = {}

function channel(c, type='square', detune=0, delay=0, attack=0.1, release=0.5, volume=1.0) {
	let osc = fc.audio.createOscillator()
	let vol = fc.audio.createGain()
	osc.type = type
	osc.detune = detune
	vol.connect(fc.audio.destination)
	osc.connect(vol)
	vol.gain.setValueAtTime(0.00001, fc.audio.currentTime)
	osc.start(0)
	
	fc.ch[c] = {
		type:type,
		a:attack,
		r:release,
		v:volume,
		del:delay,
		detune:detune,
		osc:osc,
		vol:vol
	}
}

function snd3(n, c=1, t=0.25) {
	console.log('snd3', n, c, t)
	if (!(n in fc.freq)) { return }
	// TODO: first empty channel vol.gain.value<=0.0001
	if (!(c in fc.ch)) { return }
	
	let ch = fc.ch[c]
	
	ch.vol.gain.cancelScheduledValues(fc.audio.currentTime)
	ch.vol.gain.setValueAtTime(0.0001, fc.audio.currentTime)
	ch.osc.frequency.value = fc.freq[n]
	//ch.vol.gain.linearRampToValueAtTime(ch.v, fc.audio.currentTime + ch.a + ch.del)
	ch.vol.gain.exponentialRampToValueAtTime(ch.v, fc.audio.currentTime + ch.a + ch.del)
	ch.vol.gain.setValueAtTime(ch.v, fc.audio.currentTime + t + ch.del)
	//ch.vol.gain.linearRampToValueAtTime(0.00001, fc.audio.currentTime + t + ch.r + ch.del)
	ch.vol.gain.exponentialRampToValueAtTime(0.00001, fc.audio.currentTime + t + ch.r + ch.del)

}

function snd2(n, c=1, t=0.25) {
	console.log('snd2', n, c, t)
	if (!(n in fc.freq)) { return }
	if (!(c in fc.ch)) { return }
	
	let ch = fc.ch[c]
	
	let osc = fc.audio.createOscillator()
	let vol = fc.audio.createGain()
	osc.type = ch.type
	osc.detune = ch.detune
	vol.connect(fc.audio.destination)
	osc.connect(vol)
	//
	osc.frequency.value = fc.freq[n]
	vol.gain.setValueAtTime(0.0001, fc.audio.currentTime)
	vol.gain.linearRampToValueAtTime(ch.v, fc.audio.currentTime + ch.a)
	vol.gain.setValueAtTime(ch.v, fc.audio.currentTime + t)
	vol.gain.linearRampToValueAtTime(0.00001, fc.audio.currentTime + t + ch.r)
	
	osc.start(0)
	osc.stop(fc.audio.currentTime + t)
	
	ch.osc = osc
	ch.vol = vol
}

function snd(n, t=0.25, type='square', a=0.1, r=0.1) {
	console.log('snd', n, t, a,r, type)
	if (!(n in fc.freq)) { return }
	let osc = fc.audio.createOscillator()
	let vol = fc.audio.createGain()
	osc.type = type
	vol.connect(fc.audio.destination)
	osc.connect(vol)
	//
	osc.frequency.value = fc.freq[n]
	vol.gain.setValueAtTime(0.00001, fc.audio.currentTime)
	vol.gain.linearRampToValueAtTime(1, fc.audio.currentTime + a)
	vol.gain.setValueAtTime(1, fc.audio.currentTime + t)
	vol.gain.linearRampToValueAtTime(0.00001, fc.audio.currentTime + t + r)
	
	osc.start(0)
	osc.stop(fc.audio.currentTime + t)
}


// REF: https://webaudio.github.io/web-audio-api/#OscillatorNode
// REF: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave
// REF: https://noisehack.com/generate-noise-web-audio-api/

// REF: https://en.wikipedia.org/wiki/Envelope_(music)
// REF: https://en.wikipedia.org/wiki/List_of_sound_chips
// REF: https://aselker.github.io/gameboy-sound-chip/

// REF: https://bashooka.com/coding/web-audio-javascript-libraries/
// REF: http://bit101.github.io/tones/
// REF: https://stackoverflow.com/questions/6343450/generating-sound-on-the-fly-with-javascript-html5
// REF: https://marcgg.com/blog/2016/11/01/javascript-audio/
// TODO: use howler.js ???


