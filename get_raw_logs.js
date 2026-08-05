const token = '1|T60r3QlegQSIWWQ6qmnG781rvNDasukcXWTub9tI4220041d';
const baseUrl = 'http://147.93.35.145:8000/api/v1';

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} - ${text}`);
  }
  return response.json();
}

async function run() {
  const deployUuid = 'u1psf8siykyivb23ej90dj75';
  try {
    const status = await request(`/deployments/${deployUuid}`);
    console.log('Status:', status.status);
    console.log('Finished At:', status.finished_at);
    if (status.logs) {
      const logs = JSON.parse(status.logs);
      console.log('Total log lines:', logs.length);
      console.log('--- Last 50 Log Lines ---');
      logs.slice(-50).forEach(log => {
        if (log.output) {
          console.log(`[${log.timestamp}] ${log.output.trim()}`);
        }
      });
    } else {
      console.log('No logs found in status.');
    }
  } catch (error) {
    console.error('Error during monitoring:', error.message);
  }
}

run();
