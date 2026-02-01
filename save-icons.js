// save-icons.js
const fs = require('fs');

const sets = [
  'fa', 'md', 'gi', 'si', 'io5', 'bs', 'fi', 'hi', 'tb'
];

let allIcons = [];

sets.forEach(set => {
  try {
    const icons = require(`react-icons/${set}`);
    allIcons = allIcons.concat(
      Object.keys(icons).map(name => `${set.toUpperCase()} - ${name}`)
    );
  } catch (e) {
    console.error(`Set ${set} not found.`);
  }
});

const filename = 'react-icons-list.txt';
fs.writeFileSync(filename, allIcons.join('\n'));
console.log(`Saved ${allIcons.length} icons to ${filename}`);
