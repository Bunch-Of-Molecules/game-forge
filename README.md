# Game-Forge

## What is Game-Forge?
Game-Forge is a browser-based game creation toolkit that leverages generative AI to help developers and hobbyists build complete 2D game worlds, without needing deep artistic skill. From tilemap generation to sprite sheets, physics configuration, and live game previews, Game-Forge walks creators through every layer of a 2D game's asset pipeline entirely in the browser.

## How it works?
Game-Forge has 4 classic games
- Crossy Road
- Flappy Bird
- Speed Runner
- Whack-a-Mole

The user can tweak the game's visuals and physics by using a prompt in the designated text box. The games updates as soon as the images are generated and the user can preview the new visuals and the physics configuration by testing the game right in the browser.

## Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Game Source | Phaser |
| Styling | CSS Modules |
| AI — Sprites | Google Gemini AI |
| AI — Custom Actions | Cohere |
| Deployment | Vercel |

## Project Structure
 
```
Game-Forge/
├── forge/               # Main Next.js application
│   ├── src/
│   │   ├── app/         # App Router pages & layouts
│   │   ├── components/  # UI components (sprite editor, preview, prompt window etc.)
│   │   └── ...
│   ├── public/          # Games source code
│   ├── package.json
│   └── next.config.ts
├── .gitignore
└── README.md
```
