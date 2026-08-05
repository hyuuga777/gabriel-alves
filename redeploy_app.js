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
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} - ${text}`);
  }
  return response.json();
}

async function run() {
  const appUuid = 'vulqlggjfa2i1h5xtnc1gtad';
  try {
    console.log('Triggering application redeployment in Coolify...');
    const deployResponse = await request(`/deploy?uuid=${appUuid}&force=true`, 'GET');
    console.log('Deployment triggered successfully!');
    console.log('Response:', JSON.stringify(deployResponse, null, 2));
  } catch (error) {
    console.error('Error during redeploy:', error.message);
  }
}

run();
