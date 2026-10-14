// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
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

//-------------------------------------------------------------
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

pumpkinButton.addEventListener("click", () => {
  seedCount += seedsPerClick;
  updateText();
});

//-------------------------------------------------------------
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
//water upgrade
let waterOwned = 0;
const waterRate = 1;
const waterBaseCost = 10;

const water = createUpgradeButton(waterIconURL, "Water");
const waterButton = water.button;
const waterLabel = water.label;

//calculates cost of water: more waterOwned, the price goes up 1.15 the power of waterOwned)
function waterCost(): number {
  return Math.ceil(waterBaseCost * Math.pow(1.15, waterOwned));
}

//user can only buy water if they have enough seeds, otherwise the button is disabled
//subtracts the cost of water from the seed count, adds 1 to waterOwned, and updates seedsPerSecond based on how much water is owned
waterButton.addEventListener("click", () => {
  if (seedCount < waterCost()) {
    return;
  }
  seedCount -= waterCost();
  waterOwned += 1;
  seedsPerSecond = calculateSeedsPerSecond();
  updateText();
});

//sun upgrade
let sunsOwned = 0;
const sunRate = 4;
const sunBaseCost = 100;

const sun = createUpgradeButton(sunIconURL, "Sun");
const sunButton = sun.button;
const sunLabel = sun.label;

function sunCost(): number {
  return Math.ceil(sunBaseCost * Math.pow(1.25, sunsOwned));
}

sunButton.addEventListener("click", () => {
  if (seedCount < sunCost()) return;
  seedCount -= sunCost();
  sunsOwned += 1;
  seedsPerSecond = calculateSeedsPerSecond();
  updateText();
});

//fertilizer upgrade
let fertilOwned = 0;
const fertilRate = 40;
const fertilBaseCost = 1000;

const fertilizer = createUpgradeButton(fertilizerIconURL, "Fertilizer");
const fertilButton = fertilizer.button;
const fertilLabel = fertilizer.label;

function fertilCost(): number {
  return Math.ceil(fertilBaseCost * Math.pow(1.5, fertilOwned));
}

fertilButton.addEventListener("click", () => {
  if (seedCount < fertilCost()) return;
  seedCount -= fertilCost();
  fertilOwned += 1;
  seedsPerSecond = calculateSeedsPerSecond();
  updateText();
});

//farm upgrade
let farmsOwned = 0;
const farmRate = 300;
const farmBaseCost = 10000;

const farm = createUpgradeButton(farmIconURL, "Farm");
const farmButton = farm.button;
const farmLabel = farm.label;

function farmCost(): number {
  return Math.ceil(farmBaseCost * Math.pow(1.75, farmsOwned));
}

farmButton.addEventListener("click", () => {
  if (seedCount < farmCost()) return;
  seedCount -= farmCost();
  farmsOwned += 1;
  seedsPerSecond = calculateSeedsPerSecond();
  updateText();
});

//---------------------------------------------------------------
//calculates how many seeds the user gains per second based on how many upgrades they have purchased
function calculateSeedsPerSecond(): number {
  return waterOwned * waterRate + sunsOwned * sunRate +
    fertilOwned * fertilRate + farmsOwned * farmRate;
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
function updateText() {
  updatePumpkinImage();
  seedCountText.textContent = `Seeds: ${Math.floor(seedCount)}`;
  passiveRateDisplay.textContent = `${seedsPerSecond.toFixed(1)} seeds/sec`;
  waterLabel.textContent = `Water (${waterOwned} owned) - ${waterCost()} seeds`;
  waterButton.disabled = seedCount < waterCost();
  sunLabel.textContent = `Sun (${sunsOwned} owned) - ${sunCost()} seeds`;
  sunButton.disabled = seedCount < sunCost();
  fertilLabel.textContent =
    `Fertilizer (${fertilOwned} owned) - ${fertilCost()} seeds`;
  fertilButton.disabled = seedCount < fertilCost();
  farmLabel.textContent = `Farm (${farmsOwned} owned) - ${farmCost()} seeds`;
  farmButton.disabled = seedCount < farmCost();
}

const upgradesPanel = document.createElement("div");
upgradesPanel.id = "upgrades";
upgradesPanel.append(waterButton, sunButton, fertilButton, farmButton);

updateText();
app.append(
  heading,
  pumpkinButton,
  seedCountDisplay,
  passiveRateDisplay,
  upgradesPanel,
);
requestAnimationFrame(tick);
