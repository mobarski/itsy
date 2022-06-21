# sound

## tic80

music(track=-1 frame=-1 row=-1 loop=true sustain=false tempo=-1 speed=-1)

	This function starts playing a track created in the Music Editor.
	Call without arguments to stop the music.

sfx(id note=-1 duration=-1 channel=0 volume=15 speed=0)
	
	This function will play the sound with id created in the sfx editor.
	Calling the function with id set to -1 will stop playing the channel.
	The note can be supplied as an integer between 0 and 95 (representing 8 octaves of 12 notes each)
	or as a string giving the note name and octave. For example, a note value of 14 will
	play the note D in the second octave. The same note could be specified by the string D-2.
	Note names consist of two characters, the note itself (in upper case) followed by - to represent
	the natural note or # to represent a sharp. There is no option to indicate flat values.
	The available note names are therefore: C-, C#, D-, D#, E-, F-, F#, G-, G#, A-, A#, B-.
	The octave is specified using a single digit in the range 0 to 8. The duration specifies how
	many ticks to play the sound for since TIC-80 runs at 60 frames per second, a value of 30 represents
	half a second. A value of -1 will play the sound continuously. The channel parameter indicates which
	of the four channels to use. Allowed values are 0 to 3. The volume can be between 0 and 15. The speed
	in the range -4 to 3 can be specified and means how many ticks+1 to play each step, so speed==0 means
	1 tick per step.


## pico8

SFX(N, [CHANNEL], [OFFSET], [LENGTH])

	Play sfx N (0..63) on CHANNEL (0..3) from note OFFSET (0..31 in notes) for LENGTH notes.

	Using negative CHANNEL values have special meanings:

	CHANNEL -1: (default) to automatically choose a channel that is not being used
	CHANNEL -2: to stop the given sound from playing on any channel

	N can be a command for the given CHANNEL (or all channels when CHANNEL < 0):

	N -1: to stop sound on that channel
	N -2: to release sound on that channel from looping

	SFX(3)    --  PLAY SFX 3
	SFX(3,2)  --  PLAY SFX 3 ON CHANNEL 2
	SFX(3,-2) --  STOP SFX 3 FROM PLAYING ON ANY CHANNEL
	SFX(-1,2) --  STOP WHATEVER IS PLAYING ON CHANNEL 2
	SFX(-2,2) --  RELEASE LOOPING ON CHANNEL 2
	SFX(-1)   --  STOP ALL SOUNDS ON ALL CHANNELS
	SFX(-2)   --  RELEASE LOOPING ON ALL CHANNELS


MUSIC(N, [FADE_LEN], [CHANNEL_MASK])

	Play music starting from pattern N (0..63)
	N -1 to stop music
	 
	FADE_LEN is in ms (default: 0). So to fade pattern 0 in over 1 second:

	MUSIC(0, 1000)

	CHANNEL_MASK specifies which channels to reserve for music only. For example, to play only 
	on channels 0..2:

	MUSIC(0, NIL, 7) -- 1 | 2 | 4

	Reserved channels can still be used to play sound effects on, but only when that channel 
	index is explicitly requested by @SFX().


## pyxel

Sound Class

notes
List of notes (0-127). The higher the number, the higher the pitch, and at 33 it becomes 'A2'(440Hz). The rest is -1.

tones
List of tones (0:Triangle / 1:Square / 2:Pulse / 3:Noise)

volumes
List of volumes (0-7)

effects
List of effects (0:None / 1:Slide / 2:Vibrato / 3:FadeOut)

speed
Playback speed. 1 is the fastest, and the larger the number, the slower the playback speed. At 120, the length of one note becomes 1 second.

set(notes, tones, volumes, effects, speed)
Set notes, tones, volumes, and effects with a string. If the tones, volumes, and effects length are shorter than the notes, it is repeated from the beginning.

set_notes(notes)
Set the notes with a string made of 'CDEFGAB'+'#-'+'0123' or 'R'. Case-insensitive and whitespace is ignored.
e.g. pyxel.sound(0).set_note("G2B-2D3R RF3F3F3")

set_tones(tones)
Set the tones with a string made of 'TSPN'. Case-insensitive and whitespace is ignored.
e.g. pyxel.sound(0).set_tone("TTSS PPPN")

set_volumes(volumes)
Set the volumes with a string made of '01234567'. Case-insensitive and whitespace is ignored.
e.g. pyxel.sound(0).set_volume("7777 7531")

set_effects(effects)
Set the effects with a string made of 'NSVF'. Case-insensitive and whitespace is ignored.
e.g. pyxel.sound(0).set_effect("NFNF NVVS")

Music Class

snds_list
Two-dimensional list of sounds (0-63) with the number of channels

set(snds0, snds1, snds2, snds3)
Set the lists of sound (0-63) of all channels. If an empty list is specified, that channel is not used for playback.
e.g. pyxel.music(0).set([0, 1], [2, 3], [4], [])

# text

## pyxel

text(x, y, s, col)

	Draw a string s of color col at (x, y).

## tic80

font(text x y chromakey char_width char_height fixed=false scale=1) -> width

	Print string with font defined in foreground sprites.

print(text x=0 y=0 color=15 fixed=false scale=1 smallfont=false) -> width

	This will simply print text to the screen using the font defined in config.
	When set to true, the fixed width option ensures that each character will be
	printed in a box of the same size, so the character i will occupy the same width
	as the character w for example. When fixed width is false, there will be a single
	space between each character.

trace(message color=15)

	This is a service function, useful for debugging your code.
	It prints the message parameter to the console in the (optional) color specified.


## pico8

PRINT(STR, X, Y, [COL])

PRINT(STR, [COL])

	Print a string STR and optionally set the draw colour to COL.

	Shortcut: written on a single line, ? can be used to call print without brackets: 

		?"HI"

	When X, Y are not specified, a newline is automatically appended. This can be omitted by 
	ending the string with an explicit termination control character:

		?"THE QUICK BROWN FOX\0"

	Additionally, when X, Y are not specified, printing text below 122 causes  the console to 
	scroll. This can be disabled during runtime with POKE(0x5f36,0x40).

	PRINT returns the right-most x position that occurred while printing. This can be used to 
	find out the width of some text by printing it off-screen:

		W = PRINT("HOGE", 0, -20) -- returns 16

	See @{Appendix A} (P8SCII) for information about control codes and custom fonts.


CURSOR(X, Y, [COL])

	Set the cursor position.

	If COL is specified, also set the current colour.
