# multiplayer
A calm multiplayer 3D forest survival game. The longer we survive in the forest, the more coins we get. There will be updates in the future.

## Project structure
```
multiplayer/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── docs/
    └── STRUCTURE.md
```

## How to run
From the repo root:
```
python -m http.server 8000
```
Then open `http://127.0.0.1:8000/index.html`.

## Where to look
- `index.html`: The main menu, lobby, and in-game HUD layout.
- `css/styles.css`: Shared styling for screens, cards, and HUD.
- `js/app.js`: Canvas scene rendering and mock multiplayer flow logic.
- `docs/STRUCTURE.md`: Detailed breakdown of what each file section does.
