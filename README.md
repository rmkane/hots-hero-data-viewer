# HotS Hero Data Viewer

_A Heroes of the Storm hero data parser and viewer web client._

## Introduction

First, you will need to grab the latest version of [CASCView](http://www.zezula.net/en/casc/main.html).
Once you have installed it, launch `CascView.exe`.

You will need to open up the game storage, so in order to do that, you need to locate the game installation folder.
In the ribbon, at the top of the application, choose: "Open Storage" and navigate to the following directory:

> C:\Program Files(x86)\Heroes of the Storm\HeroesData

If you installed the game anywhere else, open locate the directory. Navigating into the `HeroesData` directory is completely optional.
Once you choose the directory and press "OK", you will see a directory containing file listings.

### What we are looking for…

The interesting files are located in:

* `mods\heromods` (legacy hero data)
* `mods\heroesdata.stormmod\base.stormdata\GameData\Heroes` (latest hero data)
* `mods\heroes.stormmod\base.stormassets\Assets\Textures\storm_ui_icon_*.dds` (talent icons)

## Usage

In order to use this parser, you will need to locate the files for the hero you want.
These can be found in the [`casc-view-info.csv`](data/casc-view-info.csv) spreadsheet located in the `data` directory.

### Parsing heroes

In order to parse a different hero, you will need to find their data and text file as mentioned in the spreadsheet.
Once you have extracted those two files, rename them to `data.xml` and `strings.txt` respectively.
You can keep the name, but you must provide it in the options of the `HeroData` constructor.
You will also need to extract their icons.
If you successfully parsed the data and text files, the console will log the unique icon file names that required for rendering the icons correctly.
You will need to hunt these down yourself.

### Searching for icons

In order to find icons easily, you can use the "Search Files" tool in CASCView.
This tool can be found under the "Tools" tab at the top of the application.
The tool can be found as a button in the ribbon.
Once you open the search window, enter the pattern from the previous section, exactly as it is shown initiate the search.
The results will be the various talent icons for each hero.
I would either locate the ones from the log statement in the console, or just grab all the ones containing the hero's name or alias.
Select the icons you want to extract and save them somewhere.
You will need to convert these DDS files to PNG format.

## What are DDS files?

DDS files are texture asset files that Blizzard uses to store image data.
You will need an appropriate tool to extract these images.

The easiest way to convert these files to `.png` images is to use [GIMP](https://www.gimp.org/downloads/).
It is a free image-editing software that is a part of the [GNU](https://www.gnu.org/home.en.html) Free Software Movement.
Once you have that installed, there are two plugins you will need to import DDS files and export multiple images at once.

### GIMP plugins

The following plugins are recommended for importing and exporting DDS file in GIMP. 

* [gimp-dds](https://code.google.com/archive/p/gimp-dds/) (loads DDS files)
* [export-layers](https://khalim19.github.io/gimp-plugin-export-layers/) (optional, but preferred)

The first one enabled you open a DDS file inside GIMP.
When you load a DDS file, GIMP will ask you if you want to load minimaps, this is not necessary.
Once you have your image loaded, you can export them to PNG.
You can save a lot of time by opening all the DDS files as layers and then using the "Export Layers" option to to a bulk export.
Make sure you choose `.png` file type.
Since wer are keeping the default file names, the export will use the original DDS filename (without the extension).