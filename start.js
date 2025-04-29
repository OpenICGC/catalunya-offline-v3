const { networkInterfaces } = require('os');
const { exec } = require('child_process');
const { spawn } = require('child_process');

// troba la primera IP local no-interna (no 127.0.0.1)
function getLocalExternalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback
}


const ip = getLocalExternalIp();

console.log(`Detected local IP`);

const env = Object.create(process.env);
env.LIVE_RELOAD_IP = ip;


const child = spawn('npx', ['cap', 'run', 'android'], {
  stdio: 'inherit',
  env,
  shell: true, 
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});