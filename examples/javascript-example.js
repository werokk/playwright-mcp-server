// Example: Using Playwright MCP Server from a JavaScript/Node.js application

const PLAYWRIGHT_SERVER_URL = 'https://your-app.onrender.com';
const API_KEY = 'your-api-key-here';

// Helper function to call the Playwright MCP server
async function callPlaywrightTool(tool, args) {
  try {
    const response = await fetch(`${PLAYWRIGHT_SERVER_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        tool: tool,
        arguments: args
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Playwright tool:', error);
    throw error;
  }
}

// Example 1: Navigate to a website
async function navigateExample() {
  console.log('Navigating to example.com...');
  const result = await callPlaywrightTool('navigate', {
    url: 'https://example.com'
  });
  console.log('Navigation result:', result);
}

// Example 2: Take a screenshot
async function screenshotExample() {
  console.log('Taking screenshot...');
  const result = await callPlaywrightTool('screenshot', {
    name: 'my-screenshot',
    fullPage: true
  });
  
  // Extract the base64 image data
  const imageContent = result.content.find(c => c.type === 'image');
  if (imageContent) {
    console.log('Screenshot taken! Base64 length:', imageContent.data.length);
    // You can save this to a file or display it in your app
  }
}

// Example 3: Click a button
async function clickExample() {
  console.log('Clicking button...');
  const result = await callPlaywrightTool('click', {
    selector: 'button.submit'
  });
  console.log('Click result:', result);
}

// Example 4: Fill a form field
async function fillFormExample() {
  console.log('Filling form field...');
  const result = await callPlaywrightTool('fill', {
    selector: 'input[name="email"]',
    value: 'test@example.com'
  });
  console.log('Fill result:', result);
}

// Example 5: Evaluate JavaScript
async function evaluateExample() {
  console.log('Evaluating JavaScript...');
  const result = await callPlaywrightTool('evaluate', {
    script: 'document.title'
  });
  console.log('Evaluation result:', result);
}

// Example 6: Get page content
async function getContentExample() {
  console.log('Getting page content...');
  const result = await callPlaywrightTool('get_content', {});
  console.log('Page content length:', result.content[0].text.length);
}

// Example 7: Complete workflow - Login and screenshot
async function completeWorkflow() {
  try {
    // Navigate to login page
    await callPlaywrightTool('navigate', {
      url: 'https://example.com/login'
    });
    
    // Fill username
    await callPlaywrightTool('fill', {
      selector: 'input[name="username"]',
      value: 'myusername'
    });
    
    // Fill password
    await callPlaywrightTool('fill', {
      selector: 'input[name="password"]',
      value: 'mypassword'
    });
    
    // Click login button
    await callPlaywrightTool('click', {
      selector: 'button[type="submit"]'
    });
    
    // Wait a bit (you might need to add a wait tool)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot of logged-in page
    const screenshot = await callPlaywrightTool('screenshot', {
      name: 'logged-in',
      fullPage: true
    });
    
    console.log('Workflow completed successfully!');
    return screenshot;
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}

// Run examples
async function runExamples() {
  try {
    await navigateExample();
    await screenshotExample();
    // Uncomment to run other examples
    // await clickExample();
    // await fillFormExample();
    // await evaluateExample();
    // await getContentExample();
    // await completeWorkflow();
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Uncomment to run
// runExamples();

// Export for use in other modules
export { callPlaywrightTool };

