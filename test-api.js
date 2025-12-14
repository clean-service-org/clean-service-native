// Test script to check service-type API response
const fetch = require('node-fetch');

async function testServiceTypeAPI() {
  try {
    const response = await fetch(
      'https://cleanservice.app/api/service-type/all',
    );
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testServiceTypeAPI();
