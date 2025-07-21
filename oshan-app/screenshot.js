// Existing code in screenshot.js

// Add a new function to trigger manual screenshots
async function triggerManualScreenshot() {
  await takeScreenshot();
  console.log('Manual screenshot taken');
}

// Export the function for external calls
module.exports = {
  takeScreenshot,
  triggerManualScreenshot,
};