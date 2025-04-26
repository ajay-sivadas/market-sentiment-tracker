import { parseIVScoreCSV } from './csvParser';
import fs from 'fs';
import path from 'path';

const testCSV = fs.readFileSync(path.join(__dirname, '../data/test_iv_scores.csv'), 'utf-8');

const parsedData = parseIVScoreCSV(testCSV);

console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));

// Verify the data structure
const isValid = parsedData.every(point => 
  point.timestamp && 
  !isNaN(point.averageIVScore) && 
  !isNaN(point.closePrice)
);

console.log('Data validation:', isValid ? '✅ All points are valid' : '❌ Some points are invalid'); 