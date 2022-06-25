# ACTIVE


# TODO

- SIMPLIFY CODE AS JS IS SINGLETHREADED... DUH

- core api docs (main / init / update / draw / run)
- screen api docs
- bank api docs
- mouse api docs
- build process docs

- mouse: low delay input (time before first mouse check, time after finishig main_iter)
- mouse: out of canvas behaviour 
- touch

- text control codes
- text special commands

- sound api idea/docs
- sound
- music


- flip support in blit (ala pyxel w<0 h<0)

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

- scaling
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
