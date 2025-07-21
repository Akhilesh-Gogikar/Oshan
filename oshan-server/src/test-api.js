const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend API...');
    
    // Test stocks endpoint
    const stocksRes = await axios.get('http://localhost:5000/api/stocks');
    console.log('Stocks:', stocksRes.data);
    
    // Test insights endpoint
    const insightsRes = await axios.get('http://localhost:5000/api/insights');
    console.log('Insights:', insightsRes.data);
    
    // Test chat endpoint
    const chatRes = await axios.post('http://localhost:5000/api/chat', {
      messages: [{sender: 'user', message: 'Hello AI'}]
    });
    console.log('Chat response:', chatRes.data);
    
    console.log('✅ Backend tests completed successfully!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.response?.data || error.message);
  }
}

// Start the test
testBackend();