# API sandbox

# input

## pyxel

    mouse_x, mouse_y
    The current position of the mouse cursor

    mouse_wheel
    The current value of the mouse wheel

    btn(key)
    Return True if key is pressed, otherwise return False. (Key definition list)

    btnp(key, [hold], [repeat])
    Return True if key is pressed at that frame, otherwise return False. When hold and repeat are specified, True will be returned at the repeat frame interval when the key is held down for more than hold frames.

    btnr(key)
    Return True if key is released at that frame, otherwise return False.

    mouse(visible)
    If visible is True, show the mouse cursor. If False, hide it. Even if the mouse cursor is not displayed, its position is updated.


## pico8

Mouse and Keyboard Input

	// EXPERIMENTAL -- but mostly working on all platforms

	Mouse and keyboard input can be achieved by enabling devkit input mode:

	POKE(0x5F2D, flags) -- where flags are:

	0x1 Enable
	0x2 Mouse buttons trigger btn(4)..btn(6)
	0x4 Pointer lock (use stat 38..39 to read movements)

	Note that not every PICO-8 will have a keyboard or mouse attached to it, so when posting carts to the Lexaloffle BBS, it is encouraged to make keyboard and/or mouse control optional and off by default, if possible. When devkit input mode is enabled, a message is displayed to BBS users warning them that the program may be expecting input beyond the standard 6-button controllers.

	The state of the mouse and keyboard can be found in stat(x):

	STAT(30) -- (Boolean) True when a keypress is available
	STAT(31) -- (String) character returned by keyboard
	STAT(32) -- Mouse X
	STAT(33) -- Mouse Y
	STAT(34) -- Mouse buttons (bitfield)
	STAT(36) -- Mouse wheel event
	STAT(38) -- Relative x movement (in host desktop pixels) -- requires flag 0x4
	STAT(39) -- Relative y movement (in host desktop pixels) -- requires flag 0x4


BTN([B], [PL])

	Get button B state for player PL (default 0)

	B: 0..5: left right up down button_o button_x
	PL: player index 0..7

	Instead of using a number for B, it is also possible to use a button glyph. (In the coded editor, use Shift-L R U D O X)

	If no parameters supplied, returns a bitfield of all 12 button states for player 0 & 1 // P0: bits 0..5 P1: bits 8..13

	Default keyboard mappings to player buttons:
	 
	  player 0: [DPAD]: cursors, [O]: Z C N   [X]: X V M
	  player 1: [DPAD]: SFED,    [O]: LSHIFT  [X]: TAB W  Q A
	⚠

	Although PICO-8 accepts all button combinations, note that it is generally impossible to press both LEFT and RIGHT at the same time on a physical game controller. On some controllers, UP + LEFT/RIGHT is also awkward if [X] or [O] could be used instead of UP (e.g. to jump / accelerate).

BTNP(B, [PL])

	BTNP is short for "Button Pressed"; Instead of being true when a button is held down, BTNP returns true when a button is down AND it was not down the last frame. It also repeats after 15 frames, returning true every 4 frames after that (at 30fps -- double that at 60fps). This can be used for things like menu navigation or grid-wise player movement.

	The state that BTNP reads is reset at the start of each call to _UPDATE or _UPDATE60, so it is preferable to use BTNP from inside one of those functions.

	Custom delays (in frames 30fps) can be set by poking the following memory addresses:

	POKE(0X5F5C, DELAY) -- SET THE INITIAL DELAY BEFORE REPEATING. 255 MEANS NEVER REPEAT.
	POKE(0X5F5D, DELAY) -- SET THE REPEATING DELAY.

	In both cases, 0 can be used for the default behaviour (delays 15 and 4)

## tic80

mouse() -> x, y, left, middle, right, scrollx, scrolly
Returns

    x y : coordinates of the mouse pointer
    left : left button is down (true/false)
    middle : middle button is down (true/false)
    right : right button is down (true/false)
    scrollx : x scroll delta since last frame (-31..32)
    scrolly : y scroll delta since last frame (-31..32)


btn(id) -> pressed

	This function allows you to read the status of one of the buttons attached to TIC.
	The function returns true if the key with the supplied id is currently in the pressed state.
	It remains true for as long as the key is held down.
	If you want to test if a key was just pressed, use btnp() instead.

btnp(id hold=-1 period=-1) -> pressed

	This function allows you to read the status of one of TIC's buttons.
	It returns true only if the key has been pressed since the last frame.
	You can also use the optional hold and period parameters which allow you
	to check if a button is being held down. After the time specified by hold
	has elapsed, btnp will return true each time period is passed if the key is
	still down. For example, to re-examine the state of button 0 after 2 seconds
	and continue to check its state every 1/10th of a second, you would use btnp(0, 120, 6).
	Since time is expressed in ticks and TIC runs at 60 frames per second, we use the value
	of 120 to wait 2 seconds and 6 ticks (ie 60/10) as the interval for re-checking.

## pq93

★ btn b, [t]
	★ used to check button state, returns a boolean.
	★ b: the button you want to query. possible values are:
	• directional buttons: 'u','d','l','r'.
	• action buttons: 'a', 'b', 'x', 'y', 'start', 'select'.
	• these buttons can also be queried by index.
	★ t: indicates the button state you want to check for.
	• default behavior checks if a button is down.
	• 'p' check if a button was pressed this frame.
	• 'r' check if a button was released this frame.

★ mbtn b, [t]
	★ used to check mouse buttons, returns a boolean.
	★ b: 'l', 'r', or 'm'.
	★ t: 'p', or 'r', works as with btn.

★ mwheel
	★ returns number of "wheel ticks" scrolled this frame.

★ mouse
	★ returns the position (x, y) of the mouse cursor.



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

## pq93

Audio
sfx i, [channel, [pos, [len]]]
	★ plays sound effect i.
	★ channel dictates which of the 4 audio channels should be used; they range from 0..3. a value of -1 will choose an empty channel if available.
	★ pos specifies which beat to start on.
	★ len specifies how many beats to play before stopping.
	★ returns the audio channel used to play the sfx.

mus [i]
	★ will play pattern i, or stop all music by default.

reverb [percent]
	★ will set """reverb""" to percent, or reset to zero.
	★ try it out in a cave!

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
