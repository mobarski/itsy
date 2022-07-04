
// REF: https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
// key - piano key number
fc.freq = {
	127:12543.85,
	126:11839.82,
	125:11175.30,
	124:10548.08,
	123:9956.06,
	122:9397.27,
	121:8869.84,
	120:8372.02,
	119:7902.13,
	118:7458.62,
	117:7040.00,
	116:6644.88,
	115:6271.93,
	114:5919.91,
	113:5587.65,
	112:5274.04,
	111:4978.03,
	110:4698.64,
	109:4434.92,
	108:4186.01, // C8
	107:3951.07,
	106:3729.31,
	105:3520.00,
	104:3322.44,
	103:3135.96,
	102:2959.96,
	101:2793.83,
	100:2637.02,
	99:2489.02,
	98:2349.32,
	97:2217.46,
	96:2093.00, // C7
	95:1975.53,
	94:1864.66,
	93:1760.00,
	92:1661.22,
	91:1567.98,
	90:1479.98,
	89:1396.91,
	88:1318.51,
	87:1244.51,
	86:1174.66,
	85:1108.73,
	84:1046.50, // C6
	83:987.77,
	82:932.33,
	81:880.00,
	80:830.61,
	79:783.99,
	78:739.99,
	77:698.46,
	76:659.26,
	75:622.25,
	74:587.33,
	73:554.37,
	72:523.25, // C5
	71:493.88,
	70:466.16,
	69:440.00,
	68:415.30,
	67:392.00,
	66:369.99,
	65:349.23,
	64:329.63,
	63:311.13,
	62:293.66,
	61:277.18,
	60:261.63, // C4
	59:246.94,
	58:233.08,
	57:220.00,
	56:207.65,
	55:196.00,
	54:185.00,
	53:174.61,
	52:164.81,
	51:155.56,
	50:146.83,
	49:138.59,
	48:130.81, // C3
	47:123.47,
	46:116.54,
	45:110.00,
	44:103.83,
	43:98.00,
	42:92.50,
	41:87.31,
	40:82.41,
	39:77.78,
	38:73.42,
	37:69.30,
	36:65.41, // C2
	35:61.74,
	34:58.27,
	33:55.00,
	32:51.91,
	31:49.00,
	30:46.25,
	29:43.65,
	28:41.20,
	27:38.89,
	26:36.71,
	25:34.65,
	24:32.70, // C1
	23:30.87,
	22:29.14,
	21:27.50,  // A0
	20:25.96,
	19:24.50,
	18:23.12,
	17:21.83,
	16:20.60,
	15:19.45,
	14:18.35,
	13:17.32,
	12:16.35,
	11:15.43,
	10:14.57,
	9:13.75,
	8:12.98,
	7:12.25,
	6:11.56,
	5:10.91,
	4:10.30,
	3:9.72,
	2:9.18,
	1:8.66,
	0:8.18
}

fc.audio = new AudioContext()
fc.ch = {}

function channel(c, type='square', bpm=120, attack=0.1, release=0.3, volume=1.0, exp_attack=0, exp_release=0, detune=0, delay=0) {
	// VOL
	let vol = fc.audio.createGain()
	vol.connect(fc.audio.destination)
	vol.gain.setValueAtTime(0.00001, fc.audio.currentTime)

	// OSC
	let osc
	if (type=='noise') {
		let samples = 22050
		let buf = fc.audio.createBuffer(2, samples, 22050);
		for (let i=0; i<2; i++) {
			let data = buf.getChannelData(i)
			for (let j=0; j<buf.length; j++) {
				data[j] = Math.random()*2 - 1
			}
		}
		osc = fc.audio.createBufferSource()
		osc.buffer = buf
		osc.loop = true
	} else {
		osc = fc.audio.createOscillator()
		osc.type = type
	}
	osc.detune = detune	
	osc.connect(vol)
	osc.start(0)
	
	fc.ch[c] = {
		type:type,
		bpm:bpm,
		attack:attack,
		release:release,
		volume:volume,
		delay:delay,
		detune:detune,
		exp_attack:exp_attack,
		exp_release:exp_release,
		osc:osc,
		vol:vol
	}
}

function snd(n, c=1, d=0) {
	let t = 60/fc.ch[c].bpm * Math.pow(2,d) / 4
	console.log('snd', n, c, d, t)
	if (!(n in fc.freq)) { return }
	// TODO: first empty channel vol.gain.value<=0.0001
	if (!(c in fc.ch)) { return }
	
	let ch = fc.ch[c]
	
	// CHANGE FREQ
	ch.vol.gain.cancelScheduledValues(fc.audio.currentTime)
	ch.vol.gain.exponentialRampToValueAtTime(0.0001, fc.audio.currentTime)
	if (ch.type == 'noise') {
		ch.osc.playbackRate.setValueAtTime(fc.freq[n]/440, fc.audio.currentTime) // TODO: rate ???
	} else {
		ch.osc.frequency.setValueAtTime(fc.freq[n], fc.audio.currentTime)
	}
	
	let t_attack  = fc.audio.currentTime + ch.delay + ch.attack
	let t_sustain = fc.audio.currentTime + ch.delay + t
	let t_release = fc.audio.currentTime + ch.delay + t + ch.release
	
	// ATTACK
	if (ch.exp_attack) {
		ch.vol.gain.exponentialRampToValueAtTime(ch.volume, t_attack)
	} else {
		ch.vol.gain.linearRampToValueAtTime(ch.volume, t_attack)
	}
	
	// SUSTAIN
	ch.vol.gain.setValueAtTime(ch.volume, t_sustain)
	
	// RELEASE
	if (ch.exp_release) {
		ch.vol.gain.exponentialRampToValueAtTime(0.00001, t_release)
	} else {
		ch.vol.gain.linearRampToValueAtTime(0.00001, t_release)
	}

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


