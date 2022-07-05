
fc.has_sound = true
fc.freq = {} // key -> midi note number (0-127, 69 -> 440Hz [A4])
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

function init_sound() {
	// calculate freq table
	for (let i=0; i<128; i++) {
		fc.freq[i] = 440*Math.pow(2, (i-69)/12)
	}
}

// REF: https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
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


