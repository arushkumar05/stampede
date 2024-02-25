const express = require('express');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

const workbook = xlsx.readFile('/Users/arush/Desktop/stampede/bus schedule.xlsx');
const sheetName = 'schedule'; // Update with your sheet name
const busStops = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Define your API endpoint to get the next bus departure time
app.get('/nextBus/:stop', (req, res) => {
    const { stop } = req.params;
  
    // Find the corresponding column index for the selected bus stop
    const columnIndex = findColumnIndex(stop);
  
    if (columnIndex !== -1) {
      // Extract departure times from the selected column
      const departureTimes = busStops.map(entry => entry[Object.keys(entry)[columnIndex]]).slice(1);
  
      // Find the next departure time based on the current time
      const currentTime = moment();
      const nextDepartureTime = findNextDepartureTime(departureTimes, currentTime);
  
      if (nextDepartureTime) {
        // Calculate the countdown in minutes
        const countdown = moment(nextDepartureTime).diff(currentTime, 'minutes');
        res.json({ stop, nextDepartureTime, countdown });
      } else {
        res.json({ message: 'No more buses today.' });
      }
    } else {
      res.status(404).json({ error: 'Invalid bus stop' });
    }
  });
  
  // Function to find the column index for the selected bus stop
  function findColumnIndex(selectedStop) {
    const firstRow = busStops[0];
    const columnNames = Object.values(firstRow);
    return columnNames.findIndex(name => name === selectedStop);
  }

app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
});
