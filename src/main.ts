// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Pumpkin Clicker";

const pumpkinButton = document.createElement("pumpkinButton");
pumpkinButton.id = "pumpkin";
pumpkinButton.textContent = "🎃";
pumpkinButton.style.fontSize = "64px";

pumpkinButton.addEventListener("click", () => {
  console.log("pumpkin clicked");
});
app.append(heading, pumpkinButton);
