# Intro

## Idea

Minimalistic fantasy console API.

- super-simple API
- adjustable resolution
- adjustable color palette
- 1 bit sprite-sheets
- playscii .char support

- playscii .psci support
- simple sound-synth

## Inspiration

- Pyxel
- PICO-8
- TIC-80
- PQ93

- 1Bit-Wonder
- WASM-4
- Prism-384
- LIKO-12
- cel7

https://paladin-t.github.io/fantasy/
https://itch.io/tools/tag-fantasy-console

# API

## screen

- init(w, h, fps, [colors])
- camera(x, y)
- cls([col])
- color(col)
- pal(col1, col2)
- rect(x, y, w, h, [col])

- text(str, x, y, [bank], [col1], [col0]) -> width
- chr(i, x, y, [bank], [col1], [col0]) -> width
- str(i_list, x, y, [bank], [col1], [col0]) -> width

- ??? clip(w, y, w, h)
- ??? line(x, y, x2, y2, [col])

## input


## sound

## other

- halt()
- time() -> ms since start
