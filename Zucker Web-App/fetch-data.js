/* Get data from spreadsheet */
const SPREADSHEET_ID = '1ulSBoeYa0n3jV8AF9qoFjdEXQe5UVbVdE77oQKAHHPE';
const RANGE = 'Lookup!A2:E15';  // Change as needed

const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + encodeURIComponent(RANGE) + '?alt=json&key=AIzaSyBjlxE8qX6xq-lkHrrUj8xQ9ayumJY01zY';

let tableValue = [];

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.values && data.values.length > 0) {
      tableValue = data.values;
    } else {
      console.log('No data found');
    }
  })
  .catch(error => {
    console.error('Error fetching sheet data:', error);
  });

