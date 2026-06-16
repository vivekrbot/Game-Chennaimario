# Chennai Mario — Build Action Plan

> **How to use this file:** Save this as `CLAUDE.md` in your repo root. Claude Code in VS Code auto-loads it on every prompt, so you never have to re-explain context. Treat this as the source of truth for the project — update it as decisions evolve.

---

## 1. Project mission

Build a 2D side-scrolling platformer set in iconic Chennai locations. Browser-playable, mobile-friendly, hosted free on GitHub Pages. Ship Level 1 (Marina Beach) first, validate, then expand.

**Target experience:** A player from Chennai opens the link on their phone, plays for 3 minutes, recognizes T Nagar in the background, smiles, shares it.

**Non-goals (v1):**
- No monetization
- No accounts or login
- No multiplayer
- No app store distribution

---

## 2. Tech stack (locked — do not re-debate)

| Layer | Choice | Reason |
|---|---|---|
| Game engine | Phaser 3.70+ | 2D platformer-native, mature, free, web-first |
| Language | JavaScript (ES modules) | Lower friction than TypeScript for a solo dev; can migrate later |
| Build tool | Vite | Fastest dev loop, clean static output for GitHub Pages |
| Level editor | Tiled Map Editor | Industry standard, exports JSON Phaser reads natively |
| Art tool | Aseprite (paid, ~₹800) OR free placeholder sprites from OpenGameArt.org | Aseprite is worth it if you commit |
| Audio | Howler.js + freesound.org SFX | Howler handles browser audio quirks |
| Analytics | PostHog (free tier) | Track which levels get played, where players die |
| Hosting | GitHub Pages | Free, static, perfect fit |
| CI/CD | GitHub Actions | Auto-deploy on push to `main` |
| Optional leaderboard | Supabase (free tier) | Only add in Phase 8 if v1 lands well |

**IP safety:** The character is named **"Maari"** — not Mario. Sprites are custom pixel art inspired by the genre, not copied. Never use Nintendo assets, fonts, or sound effects. Never monetize.

---

## 3. Folder structure

```
chennai-mario/
├── CLAUDE.md                  — this file (project context for Claude Code)
├── README.md                  — public-facing description for GitHub
├── package.json
├── vite.config.js
├── index.html
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml         — auto-deploy to gh-pages
├── public/
│   └── assets/
│       ├── sprites/           — .png sprite sheets
│       ├── tilemaps/          — .json from Tiled
│       ├── audio/             — .mp3 / .ogg
│       └── fonts/             — Press Start 2P or similar
├── src/
│   ├── main.js                — Phaser game config + scene registry
│   ├── scenes/
│   │   ├── BootScene.js       — preload assets
│   │   ├── MenuScene.js       — title screen
│   │   ├── Level1Scene.js     — Marina Beach
│   │   ├── HUDScene.js        — overlay UI (score, lives, coffee count)
│   │   └── GameOverScene.js
│   ├── entities/
│   │   ├── Maari.js           — player class
│   │   ├── AutoRickshaw.js    — enemy class
│   │   └── CoffeeCup.js       — collectible class
│   ├── ui/
│   │   ├── TouchControls.js   — mobile virtual buttons
│   │   └── ScoreDisplay.js
│   ├── utils/
│   │   ├── constants.js       — speeds, gravity, world width, colors
│   │   └── analytics.js       — PostHog wrapper
│   └── data/
│       └── levels.js          — level metadata (name, world width, music)
└── dist/                      — Vite build output (gitignored, deployed)
```

---

## 4. Build phases — execute top-to-bottom

Each phase has: **Goal**, **Files**, **Claude Code prompt (copy-paste ready)**, **Done when**, **What you'll learn**.

Run each prompt one at a time in Claude Code (`claude` in VS Code terminal or the side panel). Review the diff before accepting.

---

### Phase 0 — Project scaffolding

**Goal:** Empty Vite + Phaser project deployable to GitHub Pages.

**Files:** `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `.gitignore`, `.github/workflows/deploy.yml`

**Claude Code prompt:**
```
Scaffold a Vite + Phaser 3 project for a browser game called "Chennai Mario".

Requirements:
- Use Phaser 3.70+ via npm
- Vite config must set `base: './'` so GitHub Pages relative paths work
- index.html should have a #game div, viewport meta tag for mobile, and load Press Start 2P from Google Fonts
- src/main.js initializes a Phaser game (640x360, pixel-art mode, arcade physics with gravity 1000) and registers an empty BootScene
- Add a GitHub Actions workflow at .github/workflows/deploy.yml that builds with `npm run build` and deploys /dist to gh-pages branch on push to main
- Include a .gitignore covering node_modules, dist, .DS_Store
- Add npm scripts: dev, build, preview

Do not create scene files beyond an empty BootScene yet.
```

**Done when:**
- `npm run dev` opens a black 640x360 canvas with no errors
- `npm run build` produces `/dist`
- Pushing to `main` triggers the Actions workflow

**What you'll learn:** Vite's dev server, Phaser game config object, GitHub Actions YAML basics.

---

### Phase 1 — Boot scene + asset loading

**Goal:** Load all sprite/audio assets with a loading bar.

**Files:** `src/scenes/BootScene.js`, `src/utils/constants.js`, placeholder sprites in `public/assets/sprites/`

**Claude Code prompt:**
```
In src/scenes/BootScene.js, implement asset preloading for the game.

Behavior:
- Show a centered loading bar that updates with Phaser's `load.on('progress')`
- Preload these assets (use the existing files in public/assets/sprites/ — if they don't exist, generate placeholder textures programmatically in `create()` using Phaser graphics):
  - maari (player) — 16x24
  - auto-rickshaw (enemy) — 28x22
  - coffee-cup (collectible) — 14x16
  - sand-tile — 32x32
  - stone-platform — 32x16
  - flag — 20x48
  - palm-tree — 32x64
  - cloud — 48x20
- On complete, transition to MenuScene (create it as a placeholder that just shows "Press SPACE to start")

Also create src/utils/constants.js exporting:
GAME_WIDTH, GAME_HEIGHT, GRAVITY, PLAYER_SPEED, JUMP_VELOCITY, COLORS (object with the Chennai palette: sea, sand, saffron, etc.)
```

**Done when:** Loading bar fills, MenuScene appears.

**What you'll learn:** Phaser scene lifecycle (preload → create → update), asset key conventions, programmatic texture generation.

---

### Phase 2 — Player character (Maari) + physics

**Goal:** Maari runs, jumps, has gravity, doesn't escape the world.

**Files:** `src/entities/Maari.js`, `src/scenes/Level1Scene.js`

**Claude Code prompt:**
```
Create src/entities/Maari.js — a class extending Phaser.Physics.Arcade.Sprite.

Constructor(scene, x, y):
- Sets texture to 'maari'
- Adds to scene + physics world
- Sets body size to 12x22 (slightly smaller than sprite for forgiving collisions)
- Sets bounce 0.05
- Tracks state: facing (left/right), isJumping, isStomping

Methods:
- update(cursors, touchInput) — reads input from cursor keys, WASD, and an optional touchInput object {left, right, jump}. Applies horizontal velocity ±160 and jump velocity -450 only when body.blocked.down. Flips sprite based on direction.
- die() — disables body, plays fall animation, emits 'maari:died' event
- stomp() — small bounce up (-300)

Create src/scenes/Level1Scene.js:
- Sets world bounds 3200 x 360
- Adds a temporary full-width sandy ground (static group, sand tiles from x=0 to x=3200 at y=344)
- Spawns Maari at (50, 280)
- Sets camera to follow Maari with deadzone
- Implements basic update loop calling maari.update(cursors)

Do not add enemies, collectibles, or background art yet.
```

**Done when:** You can move Maari left/right with arrow keys, jump with space, camera follows him, he falls and lands on the ground.

**What you'll learn:** ES6 classes in Phaser, arcade physics bodies, camera control.

---

### Phase 3 — Marina Beach background + level layout

**Goal:** Level looks like Marina Beach with proper terrain, gaps, and platforms.

**Files:** `src/scenes/Level1Scene.js` (extend), `src/data/levels.js`

**Claude Code prompt:**
```
Update Level1Scene to build Marina Beach.

Background (layered, parallax):
- Sky: solid color band #FFD89B at top, transitioning to #FF9E6E near horizon (4 horizontal bands)
- Sun: yellow circle (#FFE08A) top-right, scrollFactor 0
- Clouds: tile 6-8 cloud sprites across at varying heights, scrollFactor 0.5
- Sea band: rectangle #4A90A4 covering bottom 60px, behind ground
- Palm trees: place 6 palm-tree sprites at x positions [200, 600, 1100, 1700, 2300, 2900] anchored to ground

Terrain (replace the temporary full-width ground from Phase 2):
- Five ground segments with gaps between them:
  [0–800], [880–1400], [1500–2100], [2200–2700], [2780–3200]
  (gaps are 80–100px wide — wide enough to require a jump but jumpable)
- Use sand-tile (32x32) tiled across each segment at y=344
- Add 8 floating stone platforms at these (x, y) positions:
  (350, 260), (600, 220), (1050, 260), (1200, 210), (1750, 240), (1950, 200), (2400, 250), (2550, 210)

Create src/data/levels.js exporting a level1 object with: name "Marina Beach", worldWidth 3200, spawn {x:50, y:280}, music key, segments array, platforms array. Refactor Level1Scene to consume this data instead of hardcoding.

Also detect when Maari falls below y=400 — call maari.die().
```

**Done when:** Scrolling through the level shows beach scenery, you can jump gaps, falling into a gap respawns Maari.

**What you'll learn:** Parallax layers (scrollFactor), tilemap-style terrain without Tiled (good intermediate step), data-driven level design.

---

### Phase 4 — Enemies (auto-rickshaws) + collectibles (coffee cups)

**Goal:** Patrolling enemies hurt Maari (stomp to defeat), coffee cups award points.

**Files:** `src/entities/AutoRickshaw.js`, `src/entities/CoffeeCup.js`, `src/scenes/Level1Scene.js` (extend)

**Claude Code prompt:**
```
Create src/entities/AutoRickshaw.js — class extending Phaser.Physics.Arcade.Sprite.

Constructor(scene, x, y, patrolRange):
- Texture 'auto-rickshaw', collides with ground
- Patrols ±patrolRange around its spawn x at speed 50
- Flips sprite based on direction
- Method `defeat()` — destroys with a small particle burst

Create src/entities/CoffeeCup.js — class extending Phaser.Physics.Arcade.Sprite.
- Texture 'coffee-cup'
- No gravity (allowGravity: false on the body)
- Gentle vertical bobbing tween (y±4, 600ms, yoyo, repeat -1)
- Method `collect()` — emits 'coffee:collected' event with value 10, then destroys

Update Level1Scene:
- Spawn 4 auto-rickshaws at ground level at x positions [500, 1100, 1700, 2400] with patrol ranges [200, 180, 150, 200]
- Spawn ~18 coffee cups at the positions listed in src/data/levels.js (add a `coffees` array there with 18 (x,y) pairs distributed across the level — some on the ground, some on platforms, some in the air to reward jumps)
- Collision: Maari vs auto-rickshaw — if Maari's velocity.y > 0 AND Maari.y < auto.y - 4, call auto.defeat() and maari.stomp(); otherwise call maari.die()
- Overlap: Maari vs coffee cup — call cup.collect()
```

**Done when:** Auto-rickshaws move back and forth, you can jump on them to defeat, walking into one kills Maari, collecting coffee cups makes them vanish.

**What you'll learn:** Entity classes with shared parent, physics overlap vs collider, event-based game state updates.

---

### Phase 5 — HUD + game states (score, lives, win, lose)

**Goal:** Score, coffee counter, lives display. Win screen on flag touch. Game over on 0 lives.

**Files:** `src/scenes/HUDScene.js`, `src/scenes/GameOverScene.js`, `src/scenes/MenuScene.js` (extend), `src/ui/ScoreDisplay.js`

**Claude Code prompt:**
```
Create src/scenes/HUDScene.js — runs in parallel with Level1Scene (scene.launch).

Display in Press Start 2P font, 12px, top-left and top-right of screen (scrollFactor 0):
- "SCORE 0000" (top-left)
- "COFFEE ×0" (top-center)
- "LIVES ♥♥♥" (top-right)

Listens for these events on Level1Scene:
- 'coffee:collected' — increment coffee counter, add 10 to score
- 'maari:died' — decrement lives, if 0 — start GameOverScene with final score
- 'maari:stomped-enemy' — add 50 to score
- 'level:complete' — add 500, start MenuScene with "Level 1 cleared — Vanakkam!" message

Also add a flag sprite at world x=3100 in Level1Scene. Overlap Maari + flag — emit 'level:complete' and freeze Maari.

Create src/scenes/GameOverScene.js — dark overlay, "GAME OVER" text, final score, "Press R to restart" handler that restarts Level1Scene.

Update MenuScene to be a proper title screen: "CHENNAI MAARI" title, subtitle "Level 1: Marina Beach", "Press SPACE to start" prompt.
```

**Done when:** HUD updates live, reaching the flag shows a win screen, dying 3 times shows game over with restart.

**What you'll learn:** Multi-scene architecture (HUD running on top of game), event bus pattern, scene transitions.

---

### Phase 6 — Mobile touch controls

**Goal:** Game is playable on phone with on-screen buttons.

**Files:** `src/ui/TouchControls.js`, `src/scenes/Level1Scene.js` (extend)

**Claude Code prompt:**
```
Create src/ui/TouchControls.js — a class that injects DOM buttons (NOT Phaser sprites — actual HTML overlay) for mobile.

Detect touch device via 'ontouchstart' in window.

If touch device:
- Show three buttons fixed to bottom of screen:
  - Left arrow (bottom-left)
  - Right arrow (bottom-left, next to Left)
  - Jump (bottom-right, circular, larger)
- Buttons should be semi-transparent, no text selection, 60px tap targets minimum
- Track state in this.state = {left, right, jump} updated on touchstart/touchend
- Expose getInput() returning the current state

In Level1Scene, instantiate TouchControls and pass its state into maari.update(cursors, touchControls.getInput()). Maari should already accept this from Phase 2.

Style the buttons inline so they don't depend on external CSS. Use CSS variable fallbacks if you add a stylesheet.
```

**Done when:** On a phone (or Chrome DevTools mobile emulation), you see touch buttons and can play the full level.

**What you'll learn:** Hybrid DOM + canvas UI, touch event handling, why on-screen joysticks are surprisingly tricky.

---

### Phase 7 — Audio + polish

**Goal:** SFX, background music, screen shake on hit, particles.

**Files:** `src/scenes/BootScene.js` (extend), `src/entities/*` (extend)

**Claude Code prompt:**
```
Add audio to the game.

In BootScene, preload (from public/assets/audio/):
- jump.mp3 — short jump sound
- coffee.mp3 — pickup ding
- stomp.mp3 — enemy defeat
- hurt.mp3 — Maari dies
- win.mp3 — level complete
- bgm-beach.mp3 — looping background music

Wire up:
- Maari jump — play jump.mp3
- CoffeeCup.collect — play coffee.mp3
- AutoRickshaw.defeat — play stomp.mp3
- Maari.die — play hurt.mp3 + camera shake (intensity 0.005, duration 200ms)
- level:complete — play win.mp3, stop bgm
- Level1Scene create — start bgm-beach.mp3 looping at volume 0.4

Add a mute button in HUDScene (top-right corner) that toggles all audio.

If audio files don't exist yet, log a warning and skip playback rather than crashing. Document where to source CC0 audio in a comment (freesound.org).
```

**Done when:** Game has sound, mute button works, missing audio files don't break anything.

**What you'll learn:** Phaser audio API, graceful asset failure, audio UX (mute defaults, volume balance).

---

### Phase 8 — Analytics + deploy

**Goal:** Live game with PostHog tracking, deployed to GitHub Pages.

**Files:** `src/utils/analytics.js`, `index.html`, `.github/workflows/deploy.yml`

**Claude Code prompt:**
```
Create src/utils/analytics.js — a thin PostHog wrapper.

- Initialize PostHog with project key from a constant (placeholder: 'YOUR_KEY_HERE' — user will replace)
- Export a function `track(event, props)` that calls posthog.capture(event, props) but no-ops if posthog isn't loaded (so dev mode without a key doesn't error)
- Add a no-op fallback so removing the key disables analytics gracefully

Add tracking calls at these moments:
- Game start: track('level_started', {level: 'marina-beach'})
- Each death: track('maari_died', {x: maari.x, cause: 'fall' or 'enemy'})
- Coffee collected: track('coffee_collected', {totalThisRun: count})
- Level complete: track('level_completed', {level: 'marina-beach', score, time, deaths})

Update README.md with: project description, screenshot placeholder, "Play it" link, tech stack, credits (you, font, sprite source), license note (custom — not Mario IP).

Verify the GitHub Actions workflow deploys to gh-pages branch and that the site is reachable at https://<username>.github.io/chennai-mario/.
```

**Done when:** Game live on GitHub Pages, PostHog dashboard receives events, README is shareable.

**What you'll learn:** Production analytics patterns (graceful no-ops), GitHub Pages deployment quirks (the `base: './'` matters), public-facing README writing.

---

## 5. Asset checklist

Mark off as you acquire/create each. **Start with free placeholders — replace later.**

### Sprites (pixel art)
- [ ] Maari idle (16x24)
- [ ] Maari run (4-frame strip)
- [ ] Maari jump (1 frame)
- [ ] Auto-rickshaw (28x22, 2-frame wheel spin)
- [ ] Coffee cup (14x16, with steam)
- [ ] Sand tile (32x32, seamless)
- [ ] Stone platform (32x16)
- [ ] Indian flag end-goal (20x48)
- [ ] Palm tree (32x64)
- [ ] Cloud (48x20)
- [ ] Background: Marina sunset gradient
- [ ] Background: distant sea + waves

**Free sources:**
- OpenGameArt.org (filter: CC0)
- itch.io free asset packs
- Kenney.nl (massive free packs)

**Paid sources (if you commit):**
- Fiverr "pixel art commission" — ₹3,000–₹10,000 for a custom set
- Aseprite (₹800 one-time) to make your own

### Audio (.mp3 or .ogg, all CC0)
- [ ] Jump sound
- [ ] Coffee collect (positive chime)
- [ ] Enemy stomp (squish/honk — auto-rickshaw horn is on-theme)
- [ ] Maari hurt
- [ ] Level complete jingle
- [ ] Background music (chiptune beach vibe, ~30s loop)

**Source:** freesound.org, Pixabay audio, FreePD.com (CC0 music).

### Fonts
- [ ] Press Start 2P (Google Fonts) — title + HUD
- [ ] System sans for body text

---

## 6. Claude Code prompt library — copy-paste ready

Common follow-ups you'll need. Paste any of these into Claude Code as standalone requests.

### Debugging
```
Maari sometimes gets stuck on platform edges. Check the body size and platform collision in Level1Scene and fix the catch behavior.
```

### Adding a new collectible
```
Add a new collectible: "jasmine flower" worth 25 points. Spawns rarely (3 per level). Reuse the CoffeeCup class as a template — extract a base Collectible class if it makes sense.
```

### Tuning game feel
```
The jump feels floaty. Reduce jump arc by increasing gravity to 1200 and jump velocity to -420. Also add coyote time of 100ms (Maari can jump 100ms after leaving a platform).
```

### Adding Level 2 (T Nagar)
```
Scaffold Level2Scene based on Level1Scene's pattern. Theme: T Nagar shopping street. Background: storefronts, signal lights. Replace palm trees with shop signs. Replace sand with concrete tile. Same enemy/collectible pattern but increase difficulty (smaller platforms, more enemies). Add MenuScene navigation between levels.
```

### Performance audit
```
Run a performance check on Level1Scene. Count active sprites, identify any per-frame allocations in update(), and suggest pooling for any object created/destroyed frequently.
```

### Mobile-specific bug
```
On iOS Safari, touch buttons sometimes register double-jumps. Investigate touch event handling in TouchControls.js and add proper event.preventDefault + touchcancel handling.
```

---

## 7. Testing checklist (before showing anyone)

Run through this list on Chrome desktop AND Chrome on phone.

**Functional:**
- [ ] Maari runs left and right
- [ ] Maari jumps to expected height (~3 sand tiles)
- [ ] All gaps are jumpable
- [ ] All platforms are reachable
- [ ] All coffee cups are reachable (no orphans)
- [ ] All 4 enemies patrol and can be defeated
- [ ] Falling off-screen costs a life
- [ ] 3 deaths = game over
- [ ] Touching flag = win screen
- [ ] Restart works after game over
- [ ] Restart works after win

**Polish:**
- [ ] HUD updates instantly on every event
- [ ] Camera follows smoothly (no jitter)
- [ ] No console errors during a clean playthrough
- [ ] Mute button silences everything
- [ ] Game loads under 3 seconds on 4G
- [ ] Touch buttons don't cover important screen elements

**Mobile-specific:**
- [ ] Game scales to phone screen without horizontal scroll
- [ ] Touch buttons respond instantly
- [ ] No pinch-zoom triggered by gameplay
- [ ] Address bar doesn't keep showing/hiding during play

---

## 8. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Nintendo IP complaint | Low (if "Maari" + custom art) | Never use Mario name/sprites; never monetize; keep clear it's a fan-style platformer |
| Art bottleneck | High | Ship with placeholder sprites first, polish later — do not block coding on art |
| Mobile controls feel bad | High | Test on a real phone at end of Phase 6, not the end of project |
| GitHub Pages routing issues | Medium | `base: './'` in vite.config.js; test the built site locally with `npm run preview` before deploy |
| Scope creep into Level 2 | Very high | Lock yourself: no Level 2 work until Level 1 has 100 plays in PostHog |
| Phaser version churn | Low | Pin to Phaser 3.70.x in package.json, do not auto-update |

---

## 9. Learning notes (for you, Vivek)

Things this project will teach you in order of value:

1. **Phaser scene architecture** — multi-scene apps with HUD + game + transitions are the real pattern for any game beyond toy size.
2. **Arcade physics constraints** — Phaser's arcade physics is fast but axis-aligned only. You'll feel its limits and understand why complex games use Matter.js.
3. **Data-driven level design** — separating level data from level code (Phase 3) is how all serious games scale. The lesson applies to any product, not just games.
4. **Event-driven communication between scenes** — emitting events instead of direct method calls is the same pattern as Redux/Zustand on the web. Once you feel it click, you'll use it everywhere.
5. **Mobile-first canvas UX** — touch controls are a UX research problem, not a code problem. Watch a friend play on their phone — you'll learn more in 5 minutes than from any tutorial.
6. **GitHub Pages + Actions for static hosting** — transferable to portfolio sites, docs, anything static.
7. **Analytics on a real product** — PostHog events tell you whether anyone actually plays Level 1 past the first gap. That data discipline is what separates builders from tinkerers.

---

## 10. Working with Claude Code — operating notes

- **One phase at a time.** Don't paste multiple phase prompts in one message. Claude Code does best with focused scope.
- **Review every diff.** Especially in early phases — bad foundational choices compound.
- **When stuck, paste the error.** Verbatim. Don't summarize — the stack trace is the signal.
- **Update this file when decisions change.** If you switch from Vite to Webpack, update Section 2. Stale CLAUDE.md is worse than no CLAUDE.md.
- **Commit after each phase passes its "Done when" checklist.** Tag releases: `v0.1-phase1`, `v0.2-phase2`. Easy rollback if something breaks.

---

## 11. Initial setup commands (run these first)

```bash
# In your projects folder
mkdir chennai-mario && cd chennai-mario
git init
code .                          # open in VS Code

# Drop this CLAUDE.md file in the root, then in Claude Code:
# "Execute Phase 0 from CLAUDE.md"
```

That's the whole game plan. Ship Level 1. Don't think about Level 2 until 100 people have played Level 1. Good luck, and ping me when you hit your first weird Phaser bug — those are the fun ones.
