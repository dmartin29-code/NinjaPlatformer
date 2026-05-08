# StarterProject — AI Instructions

This is a high school game development class project. Students are learning to build a 2D browser game using Phaser.js with AI assistance inside VS Code.

## Project Context

- **Engine:** Phaser 3 (loaded from `node_modules/phaser/dist/phaser.min.js`)
- **Language:** Plain JavaScript — no TypeScript, no build step, no bundler
- **Preview:** Live Server extension (right-click `index.html` → Open with Live Server)
- **Entry points:** `index.html` loads Phaser, then `player.js`, then `game.js`
- **Students are beginners.** Prioritize clarity over cleverness.

## Asset Structure

All provided assets live in the `assets/` folder inside this project:

- `assets/2d/` — sprite sheets, backgrounds, tiles, characters, items, traps
- `assets/audio/` — SFX, instruments, voices

Always use **relative paths** when referencing assets. Examples:

```js
this.load.image("bg", "assets/2d/Background/Blue.png");
this.load.spritesheet(
  "player",
  "assets/2d/Main Characters/Pink Man/Run (32x32).png",
  { frameWidth: 32, frameHeight: 32 },
);
this.load.audio("jump", "assets/audio/GameSFX/jump.wav");
```

Never use absolute paths like `C:\Users\...`.

## Game Constraints

- Single player only
- Browser-based, local deploy via Live Server
- No external libraries beyond Phaser
- No backend, no server, no database

## Code Style

- Use `function` declarations (not arrow functions for scene methods)
- Player code lives in `player.js` — keep it there. Only put scene/map setup in `game.js`
- Comment any Phaser-specific API calls so the student understands what it does
- When suggesting Phaser APIs, prefer Phaser 3 syntax

## Current Project State (dev-daniel branch)

### Active Map

- **Map file:** `maps/level1.tmj` — original working JSON map, loaded with `this.load.tilemapTiledJSON("level1", ...)`
- Tileset: `"Terrain"` → `assets/2d/Terrain/Terrain (16x16).png`, layer: `"ground"`
- Has a `spawnpoints` object layer with a point object named `"player"` — player spawns there
- Has apple pickups in the `spawnpoints` layer with type `"pickups"`

### Active Player Character: Sigma

- **Sprite sheet:** `assets/Sigma.png` — 224×32px, **7 frames** in a single row, each frame **32×32px**
- Loaded with `scene.load.spritesheet("dragon", "assets/Sigma.png", { frameWidth: 32, frameHeight: 32 })`
- Scaled to `DRAGON_SCALE = 1.33` (~43×43px displayed)
- **Walk animation:** key `"dragon-walk"`, frames 0–6, frameRate 10, loops forever
  - Plays when moving left/right; stops and snaps to frame 0 when idle
- Sprite flips left/right when moving; static `Dragon solo pic.png` is no longer used
- **Controls:**
  - Arrow keys: left/right to move, up to jump, down to crouch
  - **F (hold, while airborne):** glide — caps fall speed to 60 px/s
  - **G:** toggle revolver drawn/holstered (revolver is a procedurally drawn 20×16 sprite)
- **No wall jump mechanic**
- **Physics hitbox:** 24×28px world pixels (independent of scale)
- Tuning constants at top of `player.js`: `PLAYER_SPEED`, `PLAYER_JUMP`, `DRAGON_SCALE`, `PLAYER_HITBOX_WIDTH/HEIGHT`, `GLIDE_FALL_SPEED`

### Dragon Assets (in `assets/`) — not currently active

- `Dragon solo pic.png` (32×32) — old static single-image character, no longer used
- `Dragon movement 1.png` (1407×768) — 4 dragons stacked vertically, not used
- `Dragon movement 2.png` (1407×768) — not used
- `Dragon movement 3.png` (1697×927) — not used

### Files Added from design-jeff Branch

- `assets/2d/Items/Fruits/items01.tsx` — empty tileset definition
- `maps/posttutorial.tmx` — Jeff's map (currently active, but empty)
- `maps/smeegle.tsx` — background tileset with 9 background tiles

### Original Starter Files (still present, not active)

- `maps/level1.tmj` — original working JSON map (80×25 tiles, has spawn point and pickups)
- `assets/2d/Main Characters/Pink Man/` — original Pink Man sprites (not in use)
- To revert to the original map/character, change `tilemapXML` → `tilemapTiledJSON`, key back to `"level1"`, tileset to `"Terrain"`, layer to `"ground"`, restore spawnpoints lookup, and restore Pink Man in `player.js`

## Branches

- `main` — clean student-facing base
- `dev` — teacher working branch; source of truth for the current feature set
- `MatterTest` — experimental Matter.js physics port; kept as a reference/advanced challenge, not for student distribution

### Student Branches (on remote `dmartin29-code/NinjaPlatformer`)

- `dev-daniel` — current working branch for this student (Daniel)
- `origin/design-jeff` — student branch for Jeff's design work (changes already applied to dev-daniel)
- `dev-sfletcher29-tech` — student branch (not yet pushed to remote as of last check)

### Git Config for this repo

- `user.email = dmartin29@dtechhs.org`
- `user.name = Git Commits`

## Original Starter Reference

The original starter project had:

- **Map file:** `maps/level1.tmj` — Tiled JSON, 80×25 tiles at 16×16px (1280×400px total)
- **Tileset:** `assets/2d/Terrain/Terrain (16x16).png` — 22 columns, referenced in the map as `"Terrain"`
- **Background:** `assets/2d/Background/Grid.png` — 64×64 tiling grid texture
- **Player character:** Pink Man (`assets/2d/Main Characters/Pink Man/`) — 32×32px sprites
  - Idle: 11 frames, Run: 12 frames, Jump: 1 frame, Fall: 1 frame, Crouch: 3-frame sheet
- **Spawn point:** Defined as a Tiled point object named `player` in the `spawnpoints` object layer
- **Controls:** Arrow keys — left/right to move, up to jump, down to crouch
- **Physics:** Arcade physics, gravity 600, jump velocity -500, move speed 220, `TILE_BIAS` 32
- **Player hitbox:** 20×28px (standing), 20×16px (crouching)

**Note:** When a student asks to pull changes from another branch, first run `git fetch --all` and `git branch -a` to confirm the branch exists on the remote. If it doesn't appear, the student needs to ask the branch owner to run `git push origin <branch-name>`. To apply changes without merging, use `git diff` + `git apply` or cherry-pick specific commits.

## How to Help Students

- When a student asks to add a feature, ask clarifying questions before writing code if the intent is unclear
- Suggest small, testable steps — one feature at a time
- If something won't work in a browser without a server, say so clearly
- Do not refactor working code unless the student asks
