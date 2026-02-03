# Forestbound structure guide

This document explains how the HTML, CSS, and JavaScript are organized so each part is easy to find.

## index.html (layout)
- **Main menu section**: The landing UI with quick match, lobby, and loadout buttons.
- **Lobby section**: Player list, lobby settings, and chat UI.
- **Game HUD section**: Top status bar, squad panel, objectives, and end match button.
- **Canvas element**: The forest background and player avatars are drawn here.

## css/styles.css (styling)
- **Root and reset**: Theme variables and base styles for consistent fonts and colors.
- **Screens and cards**: Menu/lobby panel layout and card visuals.
- **HUD elements**: Top bar, badges, and in-game panels.
- **Lists and chat**: Player list layout, chat log, and inputs.
- **Canvas layer**: Keeps the forest canvas behind the UI.

## js/app.js (behavior)
- **DOM references**: Grabs all buttons, panels, and HUD elements.
- **Mock squad state**: Hard-coded players for the lobby and in-game lists.
- **Canvas rendering**:
  - Background gradient and tree drawing.
  - Local player + remote avatar dots with names.
- **Game loop**:
  - Survival time, coins, and warmth updates.
  - Status badge updates for cold states.
- **UI flow**:
  - Quick match, lobby, lock-in, and start match behavior.
  - End match returns to the main menu.
- **Input handling**: WASD/arrow keys move the player.
