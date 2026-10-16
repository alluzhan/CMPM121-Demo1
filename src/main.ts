// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.

// @deno-types="./asset-url.d.ts"
import fallingLeavesURL from "./assets/fallingLeaves.png?no-inline";

// @deno-types="./asset-url.d.ts"
import smallPumpkinURL from "./assets/S_Pumpkin.png?no-inline";

// @deno-types="./asset-url.d.ts"
import mediumPumpkinURL from "./assets/M_Pumpkin.png?no-inline";

// @deno-types="./asset-url.d.ts"
import largePumpkinURL from "./assets/L_Pumpkin.png?no-inline";

// @deno-types="./asset-url.d.ts"
import seedIconURL from "./assets/pumpkinSeed.png?no-inline";

// @deno-types="./asset-url.d.ts"
import waterIconURL from "./assets/water.png?no-inline";

// @deno-types="./asset-url.d.ts"
import sunIconURL from "./assets/sunshine.png?no-inline";

// @deno-types="./asset-url.d.ts"
import fertilizerIconURL from "./assets/fertilizer.png?no-inline";

// @deno-types="./asset-url.d.ts"
import farmIconURL from "./assets/farm.png?no-inline";

// @deno-types="./asset-url.d.ts"
import farmBackgroundURL from "./assets/farmBackground.png?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

document.body.style.backgroundImage = `url(${farmBackgroundURL})`;

const heading = document.createElement("h1");
heading.textContent = "Pumpkin Clicker";

function createUpgradeButton(iconUrl: string, iconAlt: string) {
  const button = document.createElement("button");

  const icon = document.createElement("img");
  icon.src = iconUrl;
  icon.alt = iconAlt;
  icon.className = "upgrade-icon";

  const label = document.createElement("span");

  button.append(icon, label);
  return { button, label };
}

//-------------------------------------------------------------
//Falling Leaves intro sprite sheet overlay
const fallingLeaves = document.createElement("div");
fallingLeaves.id = "falling-leaves-overlay";
fallingLeaves.setAttribute("aria-hidden", "true");

const leavesSprite = document.createElement("div");
leavesSprite.id = "falling-leaves-sprite";
leavesSprite.style.backgroundImage = `url("${fallingLeavesURL}")`;

fallingLeaves.appendChild(leavesSprite);
document.body.prepend(fallingLeaves);

//-------------------------------------------------------------
//This is the pumpkin button that can be clicked to increase seed count
const pumpkinButton = document.createElement("button");
pumpkinButton.id = "pumpkin";

const pumpkinImage = document.createElement("img");
pumpkinImage.src = smallPumpkinURL;
pumpkinImage.alt = "Small pumpkin";
pumpkinButton.append(pumpkinImage);

//Button image changes based on the user's seeds per second
interface PumpkinStage {
  minRate: number;
  url: string;
  label: string;
}
const pumpkinStages: PumpkinStage[] = [
  { minRate: 0, url: smallPumpkinURL, label: "Small pumpkin" },
  { minRate: 50, url: mediumPumpkinURL, label: "Medium pumpkin" },
  { minRate: 500, url: largePumpkinURL, label: "Large pumpkin" },
];

//seed counter
let seedCount = 0;
const seedsPerClick = 2; // This is the number of seeds that will be added to the seed count every click
const seedIcon = document.createElement("img");
seedIcon.src = seedIconURL;
seedIcon.alt = "Seeds";
seedIcon.className = "seed-icon";

const seedCountText = document.createElement("span");

const seedCountDisplay = document.createElement("p");
seedCountDisplay.id = "seed-count";
seedCountDisplay.append(seedIcon, seedCountText);

pumpkinButton.addEventListener("click", (event) => {
  seedCount += seedsPerClick;
  updateText();

  //show a "+2" popup that floats up from the click and fades out
  const popup = document.createElement("span");
  popup.textContent = `+${seedsPerClick}`;
  popup.style.cssText =
    `position: fixed; left: ${event.clientX}px; top: ${event.clientY}px; font-size: 1.5rem; font-weight: bold; pointer-events: none;`;
  document.body.append(popup);

  const drift = Math.random() * 60 - 30;
  popup.animate(
    [
      { transform: "translate(-50%, -50%)" },
      { transform: `translate(calc(-50% + ${drift}px), -250%)`, opacity: 0 },
    ],
    { duration: 800, easing: "ease-out" },
  ).onfinish = () => popup.remove();
});

//Timed growth: how many seeds the user gains passivley without clicking
let seedsPerSecond = 0;
let previousTime = performance.now();
const passiveRateDisplay = document.createElement("p");
passiveRateDisplay.id = "seed-rate";

function tick(now: number) {
  const timePassed = (now - previousTime) / 1000; //calculates how much time has passed since the previous tick
  previousTime = now;
  seedCount += seedsPerSecond * timePassed;
  updateText();
  requestAnimationFrame(tick);
}

//-------------------------------------------------------------
//Defines properties each upgrade needs
interface Upgrade {
  name: string;
  iconURL: string;
  rate: number;
  baseCost: number;
  costMultiplier: number;
  owned: number;
  button: HTMLButtonElement;
  label: HTMLSpanElement;
}

//upgrade details stored here
const upgrades: Upgrade[] = [
  {
    name: "Water",
    iconURL: waterIconURL,
    rate: 1,
    baseCost: 10,
    costMultiplier: 1.15,
    owned: 0,
    ...createUpgradeButton(waterIconURL, "Water"),
  },
  {
    name: "Sun",
    iconURL: sunIconURL,
    rate: 4,
    baseCost: 100,
    costMultiplier: 1.25,
    owned: 0,
    ...createUpgradeButton(sunIconURL, "Sun"),
  },
  {
    name: "Fertilizer",
    iconURL: fertilizerIconURL,
    rate: 40,
    baseCost: 1000,
    costMultiplier: 1.5,
    owned: 0,
    ...createUpgradeButton(fertilizerIconURL, "Fertilizer"),
  },
  {
    name: "Farm",
    iconURL: farmIconURL,
    rate: 300,
    baseCost: 10000,
    costMultiplier: 1.75,
    owned: 0,
    ...createUpgradeButton(farmIconURL, "Farm"),
  },
];

//calculates cost of next upgrade
function getUpgradeCost(upgrade: Upgrade): number {
  return Math.ceil(
    upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned),
  );
}

//upgrade purchase behavior
function createUpgrade(upgrade: Upgrade): void {
  upgrade.button.addEventListener("click", () => {
    const cost = getUpgradeCost(upgrade);
    if (seedCount < cost) {
      return;
    }
    seedCount -= cost;
    upgrade.owned += 1;
    seedsPerSecond = calculateSeedsPerSecond();
    updateText();
  });
}

//apply same purchse behavior to every upgrade
for (const upgrade of upgrades) {
  createUpgrade(upgrade);
}

//---------------------------------------------------------------
//calculates how many seeds the user gains per second based on how many upgrades they have purchased
function calculateSeedsPerSecond(): number {
  return upgrades.reduce(
    (total, upgrade) => total + upgrade.owned * upgrade.rate,
    0,
  );
}

//updates the pumpkin image based on the user's seeds per second
function updatePumpkinImage() {
  let stage = pumpkinStages[0];
  for (const item of pumpkinStages) {
    if (seedsPerSecond >= item.minRate) {
      stage = item;
    }
  }

  if (pumpkinImage.src !== new URL(stage.url, location.href).href) {
    pumpkinImage.src = stage.url;
    pumpkinImage.alt = stage.label;
  }
}

//takes curerent numbers and update/formats them so the user can see the correct values on the screen
function updateText(): void {
  updatePumpkinImage();

  seedCountText.textContent = `Seeds: ${Math.floor(seedCount)}`;
  passiveRateDisplay.textContent = `${seedsPerSecond.toFixed(1)} seeds/sec`;

  for (const upgrade of upgrades) {
    const cost = getUpgradeCost(upgrade);
    upgrade.label.textContent =
      `${upgrade.name} (${upgrade.owned} owned) - ${cost} seeds`;
    upgrade.button.disabled = seedCount < cost;
  }
}

const upgradesPanel = document.createElement("div");
upgradesPanel.id = "upgrades";
upgradesPanel.append(...upgrades.map((upgrade) => upgrade.button));

updateText();
app.append(
  heading,
  pumpkinButton,
  seedCountDisplay,
  passiveRateDisplay,
  upgradesPanel,
);
requestAnimationFrame(tick);
