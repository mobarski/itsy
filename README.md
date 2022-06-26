# Intro

## Idea

Minimalistic fantasy console facade `*` for JS.

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

# API

## screen

- init(w, h, fps, [colors])
- camera(x, y)
- cls([col]) -> width, height
- color(col) -> prev_col
- pal(col1, col2) -> prev_col
- rect(x, y, w, h, [col1], [col0], [pattern])

- text(str, x, y, [font], [col1], [col0]) -> width, height
- chr(i, x, y, [font], [col1], [col0]) -> width, height
- str(i_list, x, y, [font], [col1], [col0]) -> width, height

- ??? line(x, y, x2, y2, [col])

## input

- mouse() -> mx, my, mb

## sound

- channel(n, type='square', detune=0, delay=0, attack=0.1, release=0.5, volume=1.0)
- snd(n, c=-1)

## other

- halt()
- resume()
- time() -> ms since start

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
