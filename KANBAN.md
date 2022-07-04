# ACTIVE

- mouse: fix registering button presses outside of the canvas
- touch

- screen: support float values as args (cast to int) ??? -> performance hit :(

- built-in [MRMOTEXT](https://mrmotarius.itch.io/mrmotext) charset by Mrmo Tarius

- math api

- sound api (hold note?)

# TODO

- text/chr: yscale,xscale -> scale ??? (0:1,1 1:1,2 2:2,1 3:2,2)

- core api docs (main / init / update / draw / run)

- music api idea
- sound: ch<0 -> round-robin channel selection from group (-1 -> g=1, -2 -> g=2 ...)

- SIMPLIFY CODE AS JS IS SINGLETHREADED... DUH
- mouse: low delay input (time before first mouse check, time after finishig main_iter)

- screen api docs
- font api docs
- mouse api docs
- sound api docs
- math api idea
- build process docs

- screen: flip support in blit (ala pyxel w<0 h<0)
- screen: fill pattern arg in rect

- text control codes
- text special commands

- input api idea/docs
- joypad
- text input

- draw virtual console (case, buttons, leds, etc)

- playscii .psci support

- screen recording (gif)
  - https://medium.com/@emma.pejko/making-gifs-in-javascript-497349bf3cc8
  - https://javascript.plainenglish.io/how-to-create-an-animated-gif-from-custom-canvas-frames-with-client-side-javascript-696b1ba933ba
- screen capture (gif/png)

- screen: rect/flip -> webgl version -> benchmark

# TBD

- run api -> boot,update,draw vs update,draw,boot vs draw,update,boot

- sound: replace time values (float) with 120Hz ticks ???
- rename: init->screen, channel->audio ???

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

- github pages: https://pages.github.com/  https://stackoverflow.com/questions/8446218/how-to-see-an-html-page-on-github-as-a-normal-rendered-html-page-to-see-preview
- font: faster handling of chars that are not on the screen
- mouse buttons api >>> mx,my,m1,m2 <<< vs mx,my,mb
- screen: line
- screen: rect/flip -> image/framebuffer version (put pixels into image, draw image onto canvas after draw()) -> benchmark (70fps)
- sound: type='noise'
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

# REJECTED

- option to add screen+fullscreen to document

# MVP

[x] screen
[x] bank
[ ] mouse
[ ] sound
[ ] docs: core
[ ] docs: screen
[ ] docs: bank
[ ] docs: mouse
[ ] docs: build
[ ] examples
