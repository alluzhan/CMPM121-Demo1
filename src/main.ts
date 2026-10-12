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

function render() {
  seedCountDisplay.textContent = `Seeds: ${Math.floor(seedCount)}`;
  passiveRateDisplay.textContent = `${seedsPerSecond.toFixed(1)} seeds/sec`;
}

pumpkinButton.addEventListener("click", () => {
  seedCount += seedsPerClick;
  render();
});

//-------------------------------------------------------------
//Timed growth --> how many seeds the user gains passivley without clicking
const seedsPerSecond = 1; //change to let later
let previousTime = performance.now();
const passiveRateDisplay = document.createElement("p");

function tick(now: number) {
  const timePassed = (now - previousTime) / 1000; //calculates how much time has passed since the page was loaded
  previousTime = now;
  seedCount += seedsPerSecond * timePassed;
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

render();
app.append(heading, pumpkinButton, seedCountDisplay, passiveRateDisplay);
