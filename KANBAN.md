# ACTIVE

- sound api idea/docs
- sound

# TODO

- SIMPLIFY CODE AS JS IS SINGLETHREADED... DUH
- mouse: low delay input (time before first mouse check, time after finishig main_iter)

- flip support in blit (ala pyxel w<0 h<0)

- core api docs (main / init / update / draw / run)
- screen api docs
- bank api docs
- mouse api docs
- build process docs

- mouse: out of canvas behaviour 
- touch

- text control codes
- text special commands

- music

- input api idea/docs
- joypad
- text input

- fill patterns
- option to add screen+fullscreen to document
- draw virtual console (case, buttons, leds, etc)

- playscii .psci support

- screen recording (gif)
- screen capture (gif/png)

# TBD

- font -> stream of rows, value -> number of pixels before color inversion "11101100" -> 3,1,2,2
- mouse: buttons
- font -> stream of character data
- text vs chr vs str vs blit ???
  - hide char as it can be aliased with str([i], ...)
  - OR allow i_list to be just int
  - OR hide str and allow chr to take i_list as first arg
- keyboard ???
- replace setInterval with chain of setTimeout ???

# DONE

- faster blit (+200% fps)
- fps calculation
- benchmark
- scaling
- alternative drawing method on canvas (pixel -> scaled rect)
- rename bank to font ??? ==> YES
- bank arg -> optional? move to function switch_bank? similar to color? ==> optional, default=0
- burn.py - better api -  bank -> path
- text
- playscii .char support (https://github.com/michael-lazar/playscii/tree/master/charsets)
- blit vs color

- predraw / postdraw
- frame dropping
- reset pal
- move colors to init
- boot / init / update / draw / run
- text api idea/docs
- blit - 8 pixels per value as default, blit1 for 1 pixel per value
- var vs let
- global variables -> fc object
- js/py directories

# MVP

[x] screen
[x] bank
[ ] mouse
[ ] docs: core
[ ] docs: screen
[ ] docs: bank
[ ] docs: mouse
[ ] docs: build
[ ] examples
