# Intro

## Idea

Minimalistic fantasy console facade* for JS.

- simple and easy API
- adjustable resolution
- adjustable color palette
- 1 bit sprite/font-sheets
- playscii .char support
- pure JS - no external dependencies
- embeddable into single, small JS/HTML file
- simple sound-synth with adjustable channels
- playscii .psci support (TODO)

`*` fantasy console -> https://en.wikipedia.org/wiki/Fantasy_video_game_console

`*` facade -> https://en.wikipedia.org/wiki/Facade_pattern

## Why?



# API

## screen

- **init**(w, h, fps, [colors])

- **cls**([col])  ->  [width, height]
- **color**(col)  ->  prev_col
- **rect**(x, y, w, h, [col1], [col0], [pattern])
- **line**(x0, y0, x1, y1, [col])

- **text**(str, x, y, [font], [col1], [col0])  ->  [width, height]
- **chr**(i, x, y, [font], [col1], [col0])  ->  [width, height]
- **str**(i_list, x, y, [font], [col1], [col0])  ->  [width, height]

- **camera**(x, y)
- **pal**(col1, col2)  ->  prev_col


## input

- **mouse**() -> [mx, my, m1, m2]

## sound

- **channel**(n, volume=1.0, type='square', attack=0.1, release=0.5, detune=0, delay=0)
- **snd**(n, c=-1, t=0.25, volume=1.0)

## math

- **int**(a, b=10)
- **ceil**(a)
- **floor**(a)
- **random**()
- **rnd**(a, b)
- **min**(a, ...)
- **max**(a, ...)
- **abs**(a)

## other

- **halt**()
- **resume**()
- **fullscreen**()
- **time**() -> ms since start

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
