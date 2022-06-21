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
