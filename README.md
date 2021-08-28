# GBDK export extensions for [Tiled Editor](https://www.mapeditor.org/)

Modern times come with modern tools, so instead of using Gameboy Tile Designer you can use [Tiled](https://www.mapeditor.org/) to build your Gameboy assets.

These two scripts add the option to export :

- a Tileset to **GBDK C file**, that you can load using [set_bkg_data()](https://gbdk-2020.github.io/gbdk-2020/docs/api/gb_8h.html#ac5ad2687d02b9815986cdac1b3121d15)
- a Tilemap to **GBDK C file**, that you can load using [set_bkg_tiles()](https://gbdk-2020.github.io/gbdk-2020/docs/api/gb_8h.html#ad1ec25843468eb57c54e0ebdcf532659)

## How to install

Open Tiled, go to Preferences, Plugins tab, Extensions > Open to display the extensions folder.

Clone this repo there or [download the project zip](https://github.com/kevinleguillou/tiled-gbdk-exporter/archive/refs/heads/master.zip) and extract it there. Tiled will reload all the extensions as soon as you create the files.

`Export As...` should now display a new export option in the file format list.

## How to use

Your tileset image should respect the Gameboy limitations : max 4 colors, which will be ordered by luminance when exported.

This means you can design your tiles with any color palette you want in your design tools (grayscale, shades of green, Super Gameboy, etc.), the exporting process will just convert them.

## Planned updates

✅ Remove the hardcoded palette and make it work with any type of color palette
🔲 Export Custom Properties to be used during Gameboy runtime, such as flagging tiles as walls, etc.
🔲 Export [Object layer](https://doc.mapeditor.org/en/stable/manual/objects/) info to adding checkpoints like an entrance or exit marker, etc.
🔲 Support for 2 layers maps, allowing you to create maps with Sprites over the bkg layer
🔲 Sprite export