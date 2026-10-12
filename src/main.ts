// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import _tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Pumpkin Clicker";

//-------------------------------------------------------------
//This is the pumpkin button that can be clicked to increase seed count (current image uses emoji as placeholder)
const pumpkinButton = document.createElement("button");
pumpkinButton.id = "pumpkin";
pumpkinButton.textContent = "🎃";
pumpkinButton.style.fontSize = "64px";

//-------------------------------------------------------------
//seed counter
let seedCount = 0;
const seedsPerClick = 2; // This is the number of seeds that will be added to the seed count every click. (change to let later)
const seedCountDisplay = document.createElement("p");

pumpkinButton.addEventListener("click", () => {
  seedCount += seedsPerClick;
  updateText();
});

//-------------------------------------------------------------
//Timed growth --> how many seeds the user gains passivley without clicking
let seedsPerSecond = 1;
let previousTime = performance.now();
const passiveRateDisplay = document.createElement("p");

function tick(now: number) {
  const timePassed = (now - previousTime) / 1000; //calculates how much time has passed since the previous tick
  previousTime = now;
  seedCount += seedsPerSecond * timePassed;
  updateText();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

//-------------------------------------------------------------
//water upgrade
let waterOwned = 0;
const waterRate = 0.5; //change to let later
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
  seedsPerSecond = waterOwned * waterRate;
  updateText();
});

//takes curerent numbers and updates them so the user can see the correct values on the screen
function updateText() {
  seedCountDisplay.textContent = `Seeds: ${Math.floor(seedCount)}`;
  passiveRateDisplay.textContent = `${seedsPerSecond.toFixed(1)} seeds/sec`;
  waterButton.textContent =
    `Water (${waterOwned} owned) - ${waterCost()} seeds`;
  waterButton.disabled = seedCount < waterCost();
}

updateText();
app.append(
  heading,
  pumpkinButton,
  seedCountDisplay,
  passiveRateDisplay,
  waterButton,
);
