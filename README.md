# Intro

## Idea

Minimalistic fantasy console API.

- super-simple API
- adjustable resolution
- adjustable color palette
- 1 bit sprite-sheets
- wav/mp3 sounds and music
- mrmotext friendly

## Inspiration

- Pyxel
- PICO-8
- TIC-80
- 1Bit-Wonder
- WASM-4
- Prism-384
- PQ93
- LIKO-12

https://itch.io/tools/tag-fantasy-console

# API

## screen

- init(w, h, fps, [colors])

- camera(x, y)

- cls([col])

- color(col)

- pal(col1, col2)

- rect(x, y, w, h, [col])

- tri(x1, y1, x2, y2, x3, y3, [col])

- blt(x, y, bank/sheet, u, v, w, h, [colkey])


## input


## sound

