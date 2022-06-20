# Idea

Rodzina Emulatorów Fantasy Computers preferująca liczby nieparzyste
np. sprite 7x7, paleta 7 kolorów (?) itp.
Nisko ustawione limity mają sprzyjać skupieniu się na tym co istotne
i obniżeniu kosztu produkcji.
Niecodzienne wartości (nie będące wielokrotnościami 2) mają pomóc utworzyć
spójną, niecodzienną estetykę.
Zestaw instrukcji API też stara się być minimalistyczny z takich samych powodów.

Część możliwości jest celowo bardzo wysoka aby stworzyć pewien dysonans:
- niska rozdzielczość sprite i ogromna rozdzielczość ekranu
- mała ilość kolorów ale dostępny alpha-blending
- niska rozdzielczość sprite i mało instrukcji ale dowolna rotacja, skalowanie, alpha-blending

less-is-more

Modele mają nazwy od głównego limitu - rozmiaru sprite'a.
??? Ilość kolorów w domyslnym modelu (z ostatnią cyfrą 0) jest równa rozmiarowi sprite'a.

ITSY-50: sprite 5x5, 5 kolorów
ITSY-70: sprite 7x7, 7 kolorów
ITSY-90: sprite 9x9, 9 kolorów
ITSY-110: sprite 11x11, 11 kolorów
ITSY-130: sprite 13x13, 13 kolorów
ITSY-150: sprite 15x15, 15 kolorów

podstawowa wersja obsluguje tylko 1 klawiszowa myszke / 1 punkt dotyku

# Api

core:
- **cls** - Clear the screen
- **rect** - Draw filled rectangle
- **blit** - Draw from raw data
- **spr** - Draw sprite from bank
- **mouse** - Get mouse coordinates and button states
- **pix** - Get pixel color from the screen

map:
- **map** - 
- **mget** - 
- **mset** -

rotozoom:
- **sspr,rspr** - Draw sprite using baked data, enables rotation
- **bake** - Render sprite with current palette for faster drawing

aux:
- **key** - Get key status
- **fset** - Set sprite flag
- **fget** - Get sprite flag
- **touch** - 
- **pal** - 
- **palt** - 
- **camera** - 
- **sget** - Get pixel color from the sprite sheet
- **sset** - Set pixel color on the sprite sheet
- **pset** - Set pixel color on the screen
- **keyp** - 
- **** - 

out-of-scope:
- **tri** - 
- **trib** - 
- **rectb** - 
- **line** - 
- **circ** - 
- **circb** - 

# Editor
- picker
- editor
- sheet / bank
- toolbox commands: 
  - copy & paste
  - shift*4
  - mirror*4
  - flip*2
  - clear
  - replace color *
  - TODO:
	- pick color **
	- fill **
  - OUT OF SCOPE:
	- rotate*2

# Map Editor
- tile picker
- editor

## Sprites

- C64 -> 24x21 kolory: 1+3
- zx -> brak kolory: 1+1
- nes -> 8x8 8x16
- cpc -> 16x16 kolory: 16 
- tic-80 -> 8x8*n 256+256
- pico-8 -> 8x8*n 128+128

3x32=96 wystarcza na wszystkie widzialne niskie ASCII

### ITSY

sizes? 5 7 9 11 13 15
5:25 7:49 9:81 11:121 13:169 15:225

colors? 5 7 8 9 - 12 16 24

sheet? 5:25 7:49 8:64 11:121

proportion? 16:9 16:10 2:1 3:2 1:1

resolution?

screen? solid rect circle

# FC Reference

## sprite editor
  - [ TIC-80     ](https://img.itch.zone/aW1nLzY4NTU4My5wbmc=/original/ZKjBhW.png)
  - [ LIKO-12    ](http://d2.alternativeto.net/dist/s/liko-12_541614_full.png?format=jpg&width=1600&height=1600&mode=min&upscale=false)
  - [ PICO-8     ](https://cdn.thenewstack.io/media/2016/06/pico-8-judy-300x298.png)
  - [ spritemate ](http://www.vintageisthenewold.com/wp-content/uploads/2017/10/31865103-30467f1e-b769-11e7-9f3e-c065b4413f82.png)
  - [ spritesx   ](http://gatatac.org/attachments/download/282/spriteSX_v099b_01.png)
  - [ seuck      ](http://www.c64-wiki.de/images/6/63/Seuck_Anim_SpriteEditor.gif)
  - [ makecode   ](https://pxt.azureedge.net/blob/0a1700b6821e130b4796de267cff7a4d4321843d/static/blog/arcade/spriteEditor1.jpg)
  - [ gamemaker  ](https://upload.wikimedia.org/wikipedia/en/d/d7/GK-GameMaker-Sprite-Editor.jpg)
  - [  ]()
  - [  ]()
  - [  ]()
  
## map editor
  - [ TIC-80  ](https://3.bp.blogspot.com/-67a9B-UiOMA/W67J8iP9YEI/AAAAAAAA43U/_WepL_9OMNkthAi6Ip-PowIJxLWVMWl-ACEwYBhgL/s1600/WS000001.JPG)
  - [ LIKO-12 ]()
  - [ PICO-8  ](https://www.skrolli.fi/content/uploads/2016/07/skrolli.2016.1.net_.04karttaeditori.jpg)

## api
  - [ PICO-8  ](https://www.lexaloffle.com/pico8_manual.txt)
  - [ TIC-80  ](https://github.com/nesbox/TIC-80/wiki/rect)
  - [ ITSY    ](https://github.com/mobarski/sandbox/tree/master/fc)

# JS Reference

- [ lang     ](https://www.w3schools.com/js/DEFAULT.asp)
- [ graphics ](https://www.w3schools.com/graphics/default.asp)
- [ canvas   ](https://www.w3schools.com/graphics/canvas_reference.asp)
- [ svg      ](https://www.w3schools.com/graphics/svg_reference.asp)


1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5