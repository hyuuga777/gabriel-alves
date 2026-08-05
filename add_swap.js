const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready. Setting up swap file on VPS...');
  
  const commands = [
    'dd if=/dev/zero of=/swapfile bs=1M count=2048',
    'chmod 600 /swapfile',
    'mkswap /swapfile',
    'swapon /swapfile',
    'echo "/swapfile swap swap defaults 0 0" >> /etc/fstab',
    'free -m'
  ];

  const execNext = (index) => {
    if (index >= commands.length) {
      console.log('All swap setup commands executed successfully!');
      conn.end();
      return;
    }
    const cmd = commands[index];
    console.log(`\nExecuting: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      let output = '';
      let errorOutput = '';
      stream.on('close', (code, signal) => {
        console.log(`Exit Code: ${code}`);
        if (output) console.log(`STDOUT: ${output}`);
        if (errorOutput) console.log(`STDERR: ${errorOutput}`);
        
        if (code !== 0 && !cmd.includes('fstab')) {
          console.error('Command failed. Aborting.');
          conn.end();
        } else {
          execNext(index + 1);
        }
      }).on('data', (data) => {
        output += data;
      }).stderr.on('data', (data) => {
        errorOutput += data;
      });
    });
  };

  execNext(0);
}).connect({
  host: '147.93.35.145',
  port: 22,
  username: 'root',
  password: 'j@1v1iKr8pKjrp95'
});
