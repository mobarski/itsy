# Intro

**Warning! This is pre-alpha build - anything can change without any notice.**

## Idea

Minimalistic [fantasy console](https://en.wikipedia.org/wiki/Fantasy_video_game_console) API for JS.

- simple and easy API
- adjustable resolution
- adjustable color palette
- 1 bit sprite/font-sheets
- playscii .char support
- pure JS - no external dependencies
- embeddable into single, small JS/HTML file
- simple sound-synth with adjustable channels
- playscii .psci support (TODO???)

## Why?

### To lower the entry point to programming

In the 8-bit computer era, there was an interpreter (BASIC) on every computer.
You could start programming right away and the ability of a computer to teach
its user how to program was a selling point for hardware.

The API consisted of simple words with intuitive effects.
There were even keyboards with all the commands
[printed on the keys](https://en.wikipedia.org/wiki/ZX_Spectrum#/media/File:ZXSpectrum48k.jpg)
to improve the ergonomy and facilitate exploration.

Programs written in BASIC were not 100% portable between the machines with different dialects
BUT it was easy to port them. Books and magazines contained BASIC scripts and it was quite
easy to find interesting code to play with.

Years have passed, computers are now much more powerful and the software can do amazing things.
Somehow the barier of entry into programming had risen and not went down. Sure, there are some
systems designed for kids (i.e. Scratch, MakeCode Arcade) and systems that emulate
the "old school" experience of developing software (i.e. PICO-8, TIC-80) but ... TODO ...

Reference: ["Why Johny can't code"](https://www.salon.com/2006/09/14/basic_2/)

### To explore the aesthetics of modern text-art

- https://pl.pinterest.com/search/pins/?q=textmode-game
- https://pinterest.com/search/pins/?q=mrmotext
- https://twitter.com/hashtag/MRMOTEXT
- https://twitter.com/hashtag/playscii

## Minimal example

```html
<div id="screen"></div>
<script src="itsy.js"></script>

<script>

    init(320, 200)
    cls(0)
    rect(10,  10, 300, 90, 10) // blue
    rect(10, 100, 300, 90, 4)  // yellow
    flip()

</script>
```
[See the result](https://mobarski.github.io/itsy/examples/minimal.html)

## More typical example

```html
<div id="screen"></div>
<a onclick='fullscreen()'>fullscreen</a>
<a onclick='halt()'>halt</a>
<a onclick='resume()'>resume</a>

<script src="itsy.js"></script>

<script>
    
    async function boot() {
        init(160, 144, 4, 90)
        label = "Hello World"
        frame = 0
    }
    
    function update() {
        frame += 1
    }
    
    function draw() {
        cls(0)
        for (let i=0; i<label.length; i++) {
            let x = 80 - label.length*8/2 + i*8
            let y = 72 - 8 - int(8*sin(frame/12+i/2))
            let c = (frame/4 + i)%15 + 1
            text(label[i], x, y, 0, c)
    }
    
    run(boot, update, draw)
    
</script>
```
[See the result](https://mobarski.github.io/itsy/examples/typical.html)

# API


## screen

### init
- `init(w, h, [scale], [fps], [colors])`

### cls
- `cls([col])`
- Clears the screen

### color
- `color(col) → prev_col`
- Sets the current color

### rect
- `rect(x, y, w, h, [col])`
- Draws a filled rectengle

### line
- `line(x0, y0, x1, y1, [col])`
- Draws a line

### text
- `text(str, x, y, [font], [col1], [col0])  →  [width, height]`

### chr
- `chr(i, x, y, [font], [col1], [col0])  →  [width, height]`


## screen (advanced)

### flip
- `flip()`
- Flips the back buffer to screen

### camera
- `camera(x, y)`
- Sets the camera offset - usefull for camera shaking effects

### pal
- `pal(col1, col2) → prev_col`
- Remaps color col1 to col2
- To reset all remaping call pal() without any arguments

### str
- `str(i_list, x, y, [font], [col1], [col0])  →  [width, height]`


### rect
- `rect(x, y, w, h, col1, col0, pattern)`
- TODO

## input

### mouse
- `mouse() → [mx, my, m1, m2]`
- Returns the mouse coordinates and state of both buttons
- Button state: 3 → just pressed, 2 → held, 1 → just released, 0 → not pressed


## sound

### snd
- `snd(n, c=-1, t=0.25, volume=1.0)`

### channel
- `channel**(n, volume=1.0, type='square', attack=0.1, release=0.5, detune=0, delay=0)`

## math

### int
- `int(a, [b])`

### ceil
- `ceil(a)`

### floor
- `floor(a)`

### randint
- `randint(a, b)`

### abs
- `abs(a)`

### min
- `min(a, ...)`

### max
- `max(a, ...)`

### mid
- `mid(a, b, c)`


### PI
- `PI`

### sin
- `sin(a)`

### cos
- `cos(b)`

### atan2
- `atan2(a, b)`

### sqrt
- `sqrt(a)`



## other

### halt
- `halt()`

### resume
- `resume()`

### fullscreen
- `fullscreen()`

### time
- `time() -> t`
- Returns time since start (in milliseconds)



# Reference materials

API inspiration:
- [Pyxel](https://github.com/kitao/pyxel)
- [PICO-8](https://www.lexaloffle.com/dl/docs/pico-8_manual.html)
- [TIC-80](https://tic80.com/learn)
- [PQ93](https://charliezip.itch.io/pq93)

FC inspiration:
- [Playscii](http://vectorpoem.com/playscii/)
- [PixelVision-8](https://github.com/PixelVision8/PixelVision8/wiki)
- [1Bit-Wonder](https://brastin3.itch.io/1bit-wonder)
- [cel7](https://rxi.itch.io/cel7)

Code inspiration:
- [Raccoon](https://github.com/Lyatus/raccoon)
- [Atoo](https://github.com/devicefuture/atto)
- [Octo](https://github.com/JohnEarnest/Octo)
- [PuzzleScript](https://github.com/increpare/PuzzleScript)
- [Yuki-JS](https://github.com/nrkn/yuki-js)

FC listing:
- https://paladin-t.github.io/fantasy/
- https://itch.io/tools/tag-fantasy-console
