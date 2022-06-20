===============================================================================

	ITSY v0.1
	Author: Maciej Obarski -- mobarski@gmail.com

===============================================================================



===============================================================================
	API
===============================================================================

	:: Program Structure
		
		_init()
		
		_main()
		
		_draw()
	
	
	:: Graphics
	
		color  c [a = 1]
			
			Sets the current color and alpha
		
		
		cls  c [a = 1]
		
			Clears the screen
		
		
		rect  x y w h [center = false]
        
			Draws a filled rectangle
			
		
		circ  x y r
		
			Draws a filled circle
			
		
		line  x y x2 y2 [width=1] [cap=round]
		
			Draws a line
	
	
		camera  x y [sx=1] [sy=1]
		
			Sets the screen offset and drawing scale
		
		
		fullscreen
		
			Starts the fullscreen mode
			
		
		shape  x y dots
		
			Draws a filled shape
		
		
		snapshot  [image=false] [x y] [w h]
		
			Returns ImageData or Image from the canvas or its fragment
		
		
		:: Experimental
		
		:: TO DO
		
			cursor  x y
		
				Sets the cursor position and carriage return margin

            pal  [c c2]
            
            
	:: Text
	
		print str [x y]
		
			Prints a string
		
		
		measure str
		
			Return text width in pixels
		
		
		font x
		
			Sets the font


	:: Math
	
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
	
	
	:: Time
	
		now
		
			Returns miliseconds since 1970-01-01
		
		
	:: Network

		api_get  url f
		
			Get JSON object from url and pass it to function f
		
		
		api_post  url data f
		
			Post data as JSON to url and pass the response to function f
			
	
	:: Bank
	
		-- 16x10 spriteow 8x8 + metadane 1/2/3/4 pix na spr
       
    
    :: Storage
    
    
    :: Mouse / Touch
    
        grid_click -- TODO
        
        
    :: Keyboard
	
    
    
===============================================================================

https://www.lexaloffle.com/pico-8.php?page=manual
