const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend API...');
    
    // Test stocks endpoint
    console.log('\n--- Starting Stocks Endpoint Test ---');
    try {
      const stocksRes = await axios.get('http://localhost:5000/api/stocks');
      console.log('✅ Stocks endpoint test successful.');
      console.log('Stocks data preview:', stocksRes.data ? JSON.stringify(stocksRes.data).substring(0, 100) + '...' : 'No data');
    } catch (error) {
      if (error.response) {
        console.error('❌ Stocks endpoint test failed: HTTP Status:', error.response.status, 'Response Data:', error.response.data);
      } else if (error.message) {
        console.error('❌ Stocks endpoint test failed: Error Message:', error.message);
      } else {
        console.error('❌ Stocks endpoint test failed: Unknown Error:', error);
      }
    }

    // Test insights endpoint
    console.log('\n--- Starting Insights Endpoint Test ---');
    try {
      const insightsRes = await axios.get('http://localhost:5000/api/insights');
      console.log('✅ Insights endpoint test successful.');
      console.log('Insights data preview:', insightsRes.data ? JSON.stringify(insightsRes.data).substring(0, 100) + '...' : 'No data');
    } catch (error) {
      if (error.response) {
        console.error('❌ Insights endpoint test failed: HTTP Status:', error.response.status, 'Response Data:', error.response.data);
      } else if (error.message) {
        console.error('❌ Insights endpoint test failed: Error Message:', error.message);
      } else {
        console.error('❌ Insights endpoint test failed: Unknown Error:', error);
      }
    }
    
    // Test chat endpoint
    console.log('\n--- Starting Chat Endpoint Test ---');
    try {
      const chatRes = await axios.post('http://localhost:5000/api/chat', {
        messages: [{sender: 'user', message: 'Hello AI'}]
      });
      console.log('✅ Chat endpoint test successful.');
      console.log('Chat response preview:', chatRes.data ? JSON.stringify(chatRes.data).substring(0, 100) + '...' : 'No data');
    } catch (error) {
      if (error.response) {
        console.error('❌ Chat endpoint test failed: HTTP Status:', error.response.status, 'Response Data:', error.response.data);
      } else if (error.message) {
        console.error('❌ Chat endpoint test failed: Error Message:', error.message);
      } else {
        console.error('❌ Chat endpoint test failed: Unknown Error:', error);
      }
    }
    
    console.log('\n✅ All backend tests completed. Review logs above for details.');
  } catch (error) {
    if (error.response) {
      console.error('❌ An unexpected error occurred during backend testing: HTTP Status:', error.response.status, 'Response Data:', error.response.data);
    } else if (error.message) {
      console.error('❌ An unexpected error occurred during backend testing: Error Message:', error.message);
    } else {
      console.error('❌ An unexpected error occurred during backend testing: Unknown Error:', error);
    }
  }
}

// Start the test
testBackend();