# Intro

## Idea

Minimalistic fantasy console facade for JS.

- simple and easy API
- adjustable resolution
- adjustable color palette
- 1 bit sprite/font-sheets
- playscii .char support
- pure JS - no external dependencies
- embeddable into single JS/HTML file

- simple sound-synth with adjustable channels
- playscii .psci support

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

- ??? mouse() -> mx, my, mb

## sound

## other

- halt()
- time() -> ms since start

# Reference materials

API inspiration: Pyxel, PICO-8, TIC-80, PQ93

FC inspiration: Playscii, PixelVision-8, 1Bit-Wonder, cel7

https://paladin-t.github.io/fantasy/
https://itch.io/tools/tag-fantasy-console
