# Pumpkin Clicker

Pumpkin Clicker is a incremental game where you can grow a pumpkin and collect more seeds.

Play Link: [Pumpkin Clicker](https://alluzhan.github.io/CMPM121-Demo1/)

## How To Play

1. Click on the pumpkin to generate seeds
2. Use the seeds to buy upgrades: water, sunshine, fertilizer, or a farm. Each upgrade increases the seed rate per second growth.
3. As the seed rate per second rises the pumpkin will grow bigger

## Run and Build Instructions

- Use Git and Deno 2.9.7
- deno task setup - use once per repository clone, it enables pre-commit checks
- deno task dev - run to test changes locally
- deno task ci - checks for formatting, types, lint, and build
- deno task preview - preview changes for the last time before pushing
- Deployment happens after pushing to main and is run through GitHub Actions

## Content/Shared Behaviour

Main code content is in src/main.ts, webpage styling and formatting is in index.html, and image assets are in src/assets/

- pumpkinStages (src/main.ts) is an array that changes the pumpkin image size depending on the seed rate milestone it reaches.
- upgrades array (src/main.ts) takes an entry for each upgrade to create an upgrade that has its own icon image, seed rate increase number, base cost, and cost multiplier, and count owned.

---

- getUpgradeCost(): increases the price for the next item upgrade purchase using the baseCost, costMultiplier, and owned data values
- createUpgrade(): adds purchasing behavior for when an upgrade button is clicked. Based on the cost the seedCount decreases, the upgrade total count is increased, seed rate is reassigned/calculated.
- calculateSeedsPerSecond(): adds up the 'owned' rate across all upgrades to calculate seed/rate
- updatePumpkinImage(): compares the minRate threshold value that is set for each pumpkin image to the seed rate. If the seed rate is equal to or greater than the minRate threshold then the image will change.
- tick(): uses requestAnimationFrame loop, each frame measures the seconds since the previous frame so that seed count growth time depends on real time instead of frame rate.
- createUpgradeButton(): builds the button for a upgrade with an icon image and text label.
- updateText(): updates what the player sees on screen, it changes the seed count, seed rate, updates the pumpkin images, and upgrade buttons

## Revisions

Before Revision Commit Link: https://github.com/alluzhan/CMPM121-Demo1/commit/475139067a781910fd4b36860829c261cd9a07bf

- Originally every upgrade (water, sun, fertilizer, and the farm) section was a copy of each other, with its own variables, click behaviour, cost changes, and text display updates. Adding an upgrade means copy and pasting the whole section and modifying the seeds rate formula.

After Revision Commit Link: https://github.com/alluzhan/CMPM121-Demo1/commit/81a8833b219a679bf2d11a161b8e1f45416dd1a5

- To revise the upgrades section, the upgrades were refactored into an Upgrade interface and an upgrades array. The interface describes the type of data and elements each upgrade should have, then the array stores each upgrades and their data. Each object can now be used in the same way through other functions like the createUpgrade() function. While the behavior works the same as prior to the refactoring, adding new upgrades becomes easier because they only need to add another object into the upgrades array. It also makes the code easier to change, if you need to change a price you only need to edit the data values in the array.
- This code now follows the Single Responsibility Principle because now each section in src/main.ts has a single job. Before, each upgrade would do all the work like subtracting seed counts, checking prices, adding to seed counts, and re-used a seed rate formula over and over again. With the refactoring every upgrade is handled by the same shared code.

## Credits

- Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.
- All Pumpkin Clicker Pixel Art made by Jenny Wong using [pixilart](https://www.pixilart.com/)
- Claude and Copilot for debugging and TypeScript explanations
