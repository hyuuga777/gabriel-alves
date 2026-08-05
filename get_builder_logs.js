const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready. Triggering forgot-password API request...');
  const cmd = `curl -v -X POST -H "Content-Type: application/json" -d '{"email":"admin@gabrielalves.com"}' http://127.0.0.1:3000/api/auth/forgot-password && echo "" && echo "--- CONTAINER LOGS ---" && docker logs --tail 20 vulqlggjfa2i1h5xtnc1gtad-205737924236`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('Command exited with code ' + code);
      console.log('\n--- OUTPUT ---');
      console.log(output);
      conn.end();
    }).on('data', (data) => {
      output += data;
    }).stderr.on('data', (data) => {
      output += data;
    });
  });
}).connect({
  host: '147.93.35.145',
  port: 22,
  username: 'root',
  password: 'j@1v1iKr8pKjrp95'
});
