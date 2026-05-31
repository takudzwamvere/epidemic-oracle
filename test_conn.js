const net = require('net');

function checkPort(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      console.log(`Connection to ${host}:${port} succeeded!`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log(`Connection to ${host}:${port} timed out.`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log(`Connection to ${host}:${port} failed:`, err.message);
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function main() {
  const host = '23.88.106.248';
  await checkPort(5431, host);
  await checkPort(5432, host);
}

main();
