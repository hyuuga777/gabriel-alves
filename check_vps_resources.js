const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready. Checking VPS resources...');
  conn.exec('df -h && echo "--- MEMORY ---" && free -m && echo "--- DOCKER INFO ---" && docker info | grep -i "disk\|space\|memory\|storage"', (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('Command exited with code ' + code);
      console.log('\n--- VPS RESOURCES ---');
      console.log(output);
      conn.end();
    }).on('data', (data) => {
      output += data;
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '147.93.35.145',
  port: 22,
  username: 'root',
  password: 'j@1v1iKr8pKjrp95'
});
