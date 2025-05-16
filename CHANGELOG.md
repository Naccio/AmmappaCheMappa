# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)


## [alpha.1] - UNRELEASED

### Added

- UI:
  - **Layers panel**: allows to toggle a layer's visibility and to
    choose which layer is active
    - Layers can have different types: *terrain*, *text*, *grid*
    - At the moment one layer per type is generated
    - Layers management (CRUD operations) will be added in the future
- Architecture:
  - Changelog
  - HTML checkbox inputs are used for multiple selection (*e.g.*
    visible layers)

### Changed

- UI:
  - **Toolbar**: Tools that are not availabe on the active layer are
    hidden
- Tools:
  - Tools work on specific layer types
  - **Mountains**, **Places**, **River**, **Road** and **Trees** work
    on *terrain* layers
  - **Text** works on *text* layers
  - **Eraser** works on *terrain* and *text* layers


## [alpha.0] - 2025-04-13

### Added

- Commands:
  - **New**: allows to create a new map with custom dimensions
  - **Open**: allows to load a map from a JSON file
  - **Save**: allows to download the current map as a JSON file
  - **Export**: allows to download the current map as a PNG image
- UI:
  - **Drawing area**: main element of the UI, allows to draw the map
    - Scroll to zoom
    - Click and drag with auxiliary button to move
    - Double click auxiliary button to center
  - **Main menu**:
    - *File* menu: gives access to all commands
    - *Language* menu: allows to change localization
  - **Toolbar**: allows to select a tool to use in the **drawing area**
- Tools:
  (can be used by clicking on a cell or clicking and dragging over
  multiple cells)
  - **Eraser**: allows to clear cells
  - **Mountains**: allows to draw mountains
    (4 mountains per cell will be randomly generated)
  - **Place**: allows to mark places of interest
    (one place per cell)
  - **River**: allows to draw rivers
    (connected pieces of river will be generated in each cell using
    bezier curves)
  - **Road**: allows to draw roads
    (connected pieces of road will be generated in each cell using
    straight lines)
  - **Text**: allows to add labels to the map
  - **Trees**: allows to draw trees
    (24 trees per cell will be randomly generated)
- Architecture:
  - No external libraries, NPM is used exclusively for tsc
  - Trying to be as SOLID as possible while still maintaining
    some agility
  - HTML canvas is used to draw the map
    - one canvas per layer
    - the grid is in a different layer
    - only cells that are changed are redrawn, instead of the whole layer
    - Kinda want to keep SVG open as a possibile alternative strategy
  - HTML modals are used for commands that require additional inputs
  - HTML popovers are used for menus
  - HTML radio inputs are used for exclusive selection (*e.g.* active tool)
- Localization:
  - **Italian**
  - **English**
  - Default is chosen based on browser language
- Storage:
  - Application data is stored in browser's local storage
  - Application state is restored when the application is opened
  - Stored data:
    - Active map
    - Preferred language (if changed using the *Language* menu)