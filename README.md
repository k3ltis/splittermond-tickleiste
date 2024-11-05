# Splittermond Tickleiste

This tool is meant to support combats for Splittermond pen&paper roleplaying game by providing the tick bar functionality (in German "Tickleiste") that Splittermond uses to determine the order of actions in tactical situations, typically in combat.

The tool allows to create a scene with a variable number or combatants and their respective initiaitve value at the start of the combat. By running the scene the combatants are sorted by their initiaive value and can be clicked to quickly increment their tick value. Every initiative change induces a reordering, so that you can always see the next acting participant at the top.

It's [hosted via  Github Pages](tklic.de/splittermond-tickleiste).

**Features**
* Create and name a scene with variable list of participants
* Upload and download scenes in JSON format
* Click the question mark in the upper right corner to get a tour
* Client-side scene persistence


## Assets

* SVGs from https://www.svgrepo.com/collection/dazzle-line-icons/

## Development

Start the dev server
```bash
bun run dev
```

## Deployment

Manual deployment to Github Pages
```bash
bun run build && bun run deploy
```

## License Checking


Latest check done with
```bash
license-checker --onlyAllow "MIT;Apache-2.0;ISC;BSD-2-Clause;Python-2.0;CC-BY-4.0;BSD-3-Clause;BlueOak-1.0.0;CC0-1.0"
```