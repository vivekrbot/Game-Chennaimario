# Chennai Mario

A 2D side-scrolling platformer set in iconic Chennai locations. Browser-playable, mobile-friendly, free. Run, jump, dodge auto-rickshaws, and collect filter coffee across Marina Beach.

![Chennai Mario screenshot placeholder](docs/screenshot.png)

## Play it

👉 **[https://<your-username>.github.io/chennai-mario/](https://<your-username>.github.io/chennai-mario/)**

(Replace `<your-username>` once this repo is pushed to GitHub and Pages is enabled — see [Deploying](#deploying) below.)

## Controls

- **Move:** Arrow keys / A, D
- **Jump:** Up arrow / W / Space
- **Mobile:** on-screen touch buttons appear automatically on touch devices

## Tech stack

- [Phaser 3](https://phaser.io/) (arcade physics) — game engine
- [Vite](https://vitejs.dev/) — dev server & static build
- [PostHog](https://posthog.com/) — gameplay analytics (level starts, deaths, coffee collected, level completions)
- GitHub Pages + GitHub Actions — free static hosting & CI deploy

## Deploying

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the site with `npm run build` and publishes `/dist` to the `gh-pages` branch. Enable GitHub Pages for this repo with the `gh-pages` branch as the source, then the game is live at `https://<your-username>.github.io/<repo-name>/`.

To set up analytics, replace `YOUR_KEY_HERE` in [src/utils/analytics.js](src/utils/analytics.js) with your PostHog project key. Leaving it as-is disables analytics with no errors.

## Credits

- Built by Vivek
- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)
- Placeholder sprites generated programmatically; replace with art from [OpenGameArt.org](https://opengameart.org/) (CC0) or [Kenney.nl](https://kenney.nl/) when ready
- SFX/music sources (not yet added): [freesound.org](https://freesound.org/), [Pixabay Audio](https://pixabay.com/sound-effects/), [FreePD.com](https://freepd.com/)

## License & IP note

This is an original, custom-art fan-style platformer — not affiliated with or endorsed by Nintendo. The character is named **Maari**, not Mario, with original pixel art. No Nintendo assets, fonts, or sound effects are used, and this project is never monetized.
