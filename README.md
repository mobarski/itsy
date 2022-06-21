# Intro

## Idea

Minimalistic fantasy console API.

- super-simple API
- adjustable resolution
- adjustable color palette
- 1 bit sprite-sheets
- playscii .char support (mrmotext friendly)
- simple sound-synth

## Inspiration

- Pyxel
- PICO-8
- TIC-80
- 1Bit-Wonder
- WASM-4
- Prism-384
- PQ93
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

- blit(x, y, bank, u, v, w, h, [col1], [col0])

- ??? clip


## input


## sound

