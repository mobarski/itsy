--------------------------------------------------------------------------------

ITSY v0.2
Author: Maciej Obarski -- mobarski@gmail.com

--------------------------------------------------------------------------------

API
===

Program Structure
-----------------
		
	_init()
	
	_main()
	
	_draw()
	
	
Graphics
--------

	color  c [a]
		
		Sets the current color and alpha

	
	cls  [c] [a]
	
		Clears the screen
	
	
	rect      x y w h [c] [a]
	rectfill  x y w h [c] [a]
	
		Draws a rectangle or filled rectangle
		
	
	circ      x y r [c] [a]
	circfill  x y r [c] [a]
	
		Draws a circle or a filled circle 
		
		
	line  x y x2 y2 [c] [a]
	
		Draws a line

	
	pen  [width=1] [cap=round] [join=miter]
	
		Sets style for drawing lines.
		
		cap  -- round | butt  | square
		join -- miter | round | bevel


	camera  x y [sx=1] [sy=1]
	
		Sets the screen offset and drawing scale
	
	
	fullscreen
	
		Starts the fullscreen mode
		
	
	shape      x y dots [c] [a] [close=1]
	shapefill  x y dots [c] [a]
	
		Draws a shape or filled shape
	
	
	palette  p
	
		Change palette. Argument p can be palette slug from lospec.com or string of #rrggbb values (separated by anything)
	
	
	pal  [c] [c2]
	
		Draw color c as c2.
		Without arguments: reset all remappings.
		With one argument: reset remapping for this color.
	

	-- TODO pget      x y  ->  c
	-- TODO pget_rgb  x y  ->  r g b
	
		Get the color of the pixel at x,y	
		
		
	pset  x y [c] [a]
		
		Set the pixel at x,y to color c
		
	
	rgb  c -> r g b
	
		Return r g b values of the specific color
	

	snapshot  [x y] [w h] [raw=false]
	
		Copy screen or its fragment into internal clipboard
		
	
	paste  [x y] [ix iy] [w h]
	
		Paste internal clipboard or its fragment to the screen
		
		
		
Sprites & Banks
---------------

	spr  n x y [flip_x] [flip_y] [sx] [sy]
	
		Draw sprite.
		-- Slower than xspr but doesn't require baking


	sscale  sx sy
	
		Sets the default sprite scale
			
   
	sget  n x y  ->  c
	sset  n x y c
		
		Get or set the color (c) of sprite n from the current bank
	

	bank  b  ->  prev_b
	
		Switch active bank to b


Text
----

	print str x y [c] [a]
	
		Prints a string
	
	
	measure str
	
		Return text width in pixels
	
	
	font x
	
		Sets the font


	TODO cursor  x y
	
		Sets the cursor position and carriage return margin


Math
----

	max  x y
	min  x y
	mid  x y z
	
	floor  x
	ceil   x
	sign   x
	
	sin  x
	cos  x
	
	atan2  x y
	
	abs  x
	rnd  x
	srnd  x -- TODO
	
	exp  x
	log  x
	pi


Time
----

	now
	
		Returns miliseconds since 1970-01-01
	
	
	freq  n
	
		Sets the desired main function frequency
	
Network
-------

	api_get  url f
	
		Get JSON object from url and pass it to function f
	
	
	api_post  url data f
	
		Post data as JSON to url and pass the response to function f
		
		
Storage
-------

	save  key value
	
		Save value in local storage
		
	
	load  key  ->  data

		Load value from local storage


	list  [prefix]  ->  keys

		List keys in local storage matching prefix
		

	-- TODO storage from web url / name in repo

	-- TODO storage to/from image
	
	-- TODO run program from storage

	
	env  key  ->  value
	
		Get configuration variable value


	-- TODO xxx  key value
	
		TODO Set configuration variable value

Mouse / Touch
-------------

	mouse  ->  x y m1 m2 m3
	
		...
	
	
	mousebtn  b  ->  status x y xp yp
		
		Returns status of the specific mouse key, current x,y coords
		and x,y coords when the button was pressed.
		
		Status:
			3 -> just pressed
			2 -> held
			1 -> just released
			0 -> up
	
	
Keyboard
--------


Other
-----

	meta  key
	
		Return metadata / configuration
			w -> screen width
			h -> screen height
			sw -> sprite width
			sh -> sprite height
			freq -> main loop frequency
			bw -> bank width (in sprites)
			bh -> bank height (in sprites)
			pal -> palette length
			banks -> list of bank ids


Sprite Editor
=============

	Sprite Editor app consists of following components:
	- Color Picker
	- Bank Viewer
	- Pixel Editor
	- Editor Toolbar (TODO)
	- Sprite Preview (TODO)
	
	
	Bank Viewer
		
		LMB -- select sprite & save bank
		MMB -- clear sprite
		drag LMB -- swap sprites (TODO)
		drag RMB -- copy sprites (TODO)


	Pixel Editor

		LMB -- set pixel to foreground color
		RMB -- set pixel to background color
		MMB -- flip - depending on position (TODO)
		drag MMB -- mirror|move - depending on position (TODO)

	Color Picker
	
		LMB -- select foreground color
		RMB -- select background color
		drag LMB -- recolor|swap in sprite (TODO)
		drag RMB -- recolor|swap in bank (TODO)
		drag MMB -- change palette (TODO)
	
	
Parameters
----------

	bank
		key -- bank key, default=spr_ed_v3
		bw  -- bank width, default=5
		bh  -- bank height, default=5
		sw  -- sprite width, default=8
		sh  -- sprite height, default=8
	
	color picker
		cpx  -- position
		cpy  -- position
		cpw  -- tile width
		cph  -- tile height
		cpny -- rows
		cpm  -- margin
	
	bank viewer
		bvx  -- position
		bvy  -- position
		bvsx -- scale x
		bvsy -- scale y
		bvm  -- margin
	
	pixel editor
		pex  -- position
		pey  -- position
		pesx -- scale x
		pesy -- scale y
		pem  -- margin
	
	
Roadmap
=======

	0.2 - Banks & Sprites
	
		Banks
			+ encode image
			+ decode image
			+ pack data
			+ unpack data
			+ bank geometry
			+ new bank
			+ get sprite pixel
			+ set sprite pixel
			+ get single sprite
			+ set single sprite
			+ unflat
			+ serialize bank
			+ deserialize bank
			+ bank export
			+ bank import
	
		Sprites
			+ spr
			+ sscale

	
	0.3 - Sprite Editor & metadata

		Sprite Editor MVP (single bank)
			+ color picker
			+ bank viewer / sprite selector
			+ sprite editor
			+ rmb -> bg color
			+ auto save
			+ auto load
			+ active colors
			+ clear as MMB on viewer/editor
			- configuration / invocation
			+ documentation
		
		Metadata API (bw bh sw sh pal.length)
			+ meta
			+ refactor existing code
	
	
	0.4 
		
		Env
			+ passing parametrs via url
			- save/load env to/from local storage
		
		Banks2 vs Banks refactoring 
	
		Encode/Decode/Export/Import refactoring
			+ ser_spr
			+ deser_spr
			+ encode_bank
			- decode_bank

		Sprites
			- bake
			- xspr
			- sspr
		
		Sprite Editor Enhancements
			- drag & drop sprites -> LMB:swap, RMB:clone
			- toolbar -> flip*2, mirror*4, shift*4, shadow
			- palette ops (next,prev,save,load)
			- sprite preview (variable zoom)
	
	0.5 - Map & Map editor
	
		Map
		
		Map Editor
	
	0.6 - Fonts & Text
	
		Fonts
		
		Text
		- color markup
		- margin & newline
		- colision (for wordcloud)
		
	
	0.7 - GIF Recorder
	
	0.8 - Sound
		
	0.9 - Music
	
	Shader-like-effects
	
	Multitouch

	Banks
		? get multi-sprite
		? set multi-sprite
	
	
-------------------------------------------------------------------------------

Ideas
=====


Reference
=========

API
---

	pico8 -- https://www.lexaloffle.com/pico-8.php?page=manual
	tic80 -- https://github.com/nesbox/TIC-80/wiki


Sprite editor
-------------

	TIC-80     -- https://img.itch.zone/aW1nLzY4NTU4My5wbmc=/original/ZKjBhW.png
	LIKO-12    -- http://d2.alternativeto.net/dist/s/liko-12_541614_full.png?format=jpg&width=1600&height=1600&mode=min&upscale=false
	PICO-8     -- https://cdn.thenewstack.io/media/2016/06/pico-8-judy-300x298.png
	spritemate -- http://www.vintageisthenewold.com/wp-content/uploads/2017/10/31865103-30467f1e-b769-11e7-9f3e-c065b4413f82.png
	spritesx   -- http://gatatac.org/attachments/download/282/spriteSX_v099b_01.png
	seuck      -- http://www.c64-wiki.de/images/6/63/Seuck_Anim_SpriteEditor.gif
	makecode   -- https://pxt.azureedge.net/blob/0a1700b6821e130b4796de267cff7a4d4321843d/static/blog/arcade/spriteEditor1.jpg
	gamemaker  -- https://upload.wikimedia.org/wikipedia/en/d/d7/GK-GameMaker-Sprite-Editor.jpg
  
  
Map editor
----------

	TIC-80  -- https://3.bp.blogspot.com/-67a9B-UiOMA/W67J8iP9YEI/AAAAAAAA43U/_WepL_9OMNkthAi6Ip-PowIJxLWVMWl-ACEwYBhgL/s1600/WS000001.JPG
	LIKO-12 -- 
	PICO-8  -- https://www.skrolli.fi/content/uploads/2016/07/skrolli.2016.1.net_.04karttaeditori.jpg


Java Script
-----------

	lang     -- https://www.w3schools.com/js/DEFAULT.asp
	graphics -- https://www.w3schools.com/graphics/default.asp
	canvas   -- https://www.w3schools.com/graphics/canvas_reference.asp
	svg      -- https://www.w3schools.com/graphics/svg_reference.asp

	get / put imagedata
		- https://www.w3schools.com/tags/canvas_getimagedata.asp
		- https://www.w3schools.com/tags/canvas_putimagedata.asp
	
	canvas double buffering
		- https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
		- http://devbutze.blogspot.com/2013/09/requestanimationframe-is-what-you-need.html
