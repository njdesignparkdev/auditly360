const { exec } = require('child_process');
const fs = require('fs');

exec('npm run build', (error, stdout, stderr) => {
  const output = stdout + '\n' + stderr;
  fs.writeFileSync('build-output-clean.txt', output, 'utf8');
  console.log('Build output saved to build-output-clean.txt');
  console.log(output);
});
