// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import smallPumpkinURL from "./assets/S_Pumpkin.png?no-inline";

// @deno-types="./asset-url.d.ts"
import mediumPumpkinURL from "./assets/M_Pumpkin.png?no-inline";

// @deno-types="./asset-url.d.ts"
import largePumpkinURL from "./assets/L_Pumpkin.png?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Pumpkin Clicker";

//-------------------------------------------------------------
//This is the pumpkin button that can be clicked to increase seed count
const pumpkinButton = document.createElement("button");
pumpkinButton.id = "pumpkin";

const pumpkinImage = document.createElement("img");
pumpkinImage.src = smallPumpkinURL;
pumpkinImage.alt = "Small pumpkin";
pumpkinImage.width = 128;
pumpkinImage.height = 128;
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
const seedsPerClick = 2; // This is the number of seeds that will be added to the seed count every click. (change to let later)
const seedCountDisplay = document.createElement("p");
seedCountDisplay.id = "seed-count";

pumpkinButton.addEventListener("click", () => {
  seedCount += seedsPerClick;
  updateText();
});

//-------------------------------------------------------------
//Timed growth --> how many seeds the user gains passivley without clicking
let seedsPerSecond = 0; //start at 0 or change to 1
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
const waterRate = 1; //change to let later
const waterBaseCost = 10; //change to let later

const waterButton = document.createElement("button");
//calculates cost of water --> more waterOwned, the price goes up 1.15 the power of waterOwned)
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

//-------------------------------------------------------------
//sun upgrade
let sunsOwned = 0;
const sunRate = 4;
const sunBaseCost = 100;

const sunButton = document.createElement("button");

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

//-------------------------------------------------------------
//fertilizer upgrade
let fertilOwned = 0;
const fertilRate = 40;
const fertilBaseCost = 1000;

const fertilButton = document.createElement("button");

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

//--------------------------------------------------------------
//farm upgrade
let farmsOwned = 0;
const farmRate = 300;
const farmBaseCost = 10000;

const farmButton = document.createElement("button");

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

//-------------------------------------------------------------
//calculates how many seeds the user gains per second based on how many upgrades they have purchased
function calculateSeedsPerSecond(): number {
  return waterOwned * waterRate + sunsOwned * sunRate +
    fertilOwned * fertilRate + farmsOwned * farmRate;
}

//-------------------------------------------------------------
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

//-------------------------------------------------------------
//takes curerent numbers and updates them so the user can see the correct values on the screen
function updateText() {
  updatePumpkinImage();
  seedCountDisplay.textContent = `Seeds: ${Math.floor(seedCount)}`;
  passiveRateDisplay.textContent = `${seedsPerSecond.toFixed(1)} seeds/sec`;
  waterButton.textContent =
    `Water (${waterOwned} owned) - ${waterCost()} seeds`;
  waterButton.disabled = seedCount < waterCost();
  sunButton.textContent = `Sun (${sunsOwned} owned) - ${sunCost()} seeds`;
  sunButton.disabled = seedCount < sunCost();
  fertilButton.textContent =
    `Fertilizer (${fertilOwned} owned) - ${fertilCost()} seeds`;
  fertilButton.disabled = seedCount < fertilCost();
  farmButton.textContent = `Farm (${farmsOwned} owned) - ${farmCost()} seeds`;
  farmButton.disabled = seedCount < farmCost();
}

updateText();
app.append(
  heading,
  pumpkinButton,
  seedCountDisplay,
  passiveRateDisplay,
  waterButton,
  sunButton,
  fertilButton,
  farmButton,
);
requestAnimationFrame(tick);
