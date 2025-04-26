import { parseIVScoreCSV } from "./csvParser.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testCSV = fs.readFileSync(
  path.join(__dirname, "../data/ivscore.csv"),
  "utf-8"
);

const parsedData = parseIVScoreCSV(testCSV);

// Print first few records for verification
console.log(
  "First 5 parsed records:",
  JSON.stringify(parsedData.slice(0, 5), null, 2)
);

// Verify the data structure
const isValid = parsedData.every(
  (point) =>
    point.timestamp && !isNaN(point.averageIVScore) && !isNaN(point.closePrice)
);

// Print statistics
console.log("\nData Statistics:");
console.log("Total records:", parsedData.length);
console.log("First timestamp:", parsedData[0]?.timestamp);
console.log("Last timestamp:", parsedData[parsedData.length - 1]?.timestamp);
console.log("Average IV Score range:", {
  min: Math.min(...parsedData.map((p) => p.averageIVScore)),
  max: Math.max(...parsedData.map((p) => p.averageIVScore)),
});
console.log("Close Price range:", {
  min: Math.min(...parsedData.map((p) => p.closePrice)),
  max: Math.max(...parsedData.map((p) => p.closePrice)),
});

console.log(
  "\nData validation:",
  isValid ? "✅ All points are valid" : "❌ Some points are invalid"
);
