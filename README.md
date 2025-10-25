# Playwright MCP Server

A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright. This server can run in both stdio mode (for local MCP clients) and HTTP mode (for cloud deployment on platforms like Render).

## Features

- **Comprehensive Browser Automation**: 30+ Playwright tools covering all major browser automation tasks
- **Full Navigation Control**: Navigate, reload, go back/forward, handle URLs and page titles
- **Element Interactions**: Click, fill, select dropdowns, hover, check/uncheck checkboxes
- **Keyboard Actions**: Press keys, type text with customizable delays
- **Element Inspection**: Get text, attributes, visibility, enabled state, element counts
- **Wait & Timing**: Wait for selectors, timeouts for dynamic content
- **Screenshots & PDFs**: Capture full-page or viewport screenshots, generate PDFs
- **Cookie Management**: Get, set, and delete cookies
- **JavaScript Execution**: Run custom JavaScript in the browser context
- **Viewport Control**: Set custom viewport sizes for responsive testing
- **Dual Mode**: Run as MCP stdio server locally or as HTTP API on cloud platforms
- **Secure**: API key authentication and CORS support for web app integration
- **Docker Support**: Containerized for easy deployment on Render

## Available Tools (30+ Playwright Actions)

### Navigation & Page Control
1. **navigate** - Navigate to a URL
   - Parameters: `url` (string)

2. **go_back** - Navigate back in browser history

3. **go_forward** - Navigate forward in browser history

4. **reload** - Reload the current page

5. **get_url** - Get the current page URL

6. **get_title** - Get the page title

### Element Interactions
7. **click** - Click an element
   - Parameters: `selector` (string)

8. **fill** - Fill a form field
   - Parameters: `selector` (string), `value` (string)

9. **select** - Select an option from a dropdown
   - Parameters: `selector` (string), `value` (string)

10. **hover** - Hover over an element
    - Parameters: `selector` (string)

11. **check** - Check a checkbox/radio button
    - Parameters: `selector` (string)

12. **uncheck** - Uncheck a checkbox
    - Parameters: `selector` (string)

### Keyboard Actions
13. **press_key** - Press a keyboard key
    - Parameters: `key` (string), `selector` (string, optional)

14. **type_text** - Type text character by character
    - Parameters: `selector` (string), `text` (string), `delay` (number, optional)

### Element Information
15. **get_text** - Get element text content
    - Parameters: `selector` (string)

16. **get_attribute** - Get element attribute value
    - Parameters: `selector` (string), `attribute` (string)

17. **get_content** - Get the HTML content of the page

18. **is_visible** - Check if element is visible
    - Parameters: `selector` (string)

19. **is_enabled** - Check if element is enabled
    - Parameters: `selector` (string)

20. **is_checked** - Check if checkbox/radio is checked
    - Parameters: `selector` (string)

21. **count_elements** - Count elements matching selector
    - Parameters: `selector` (string)

### Waiting & Timing
22. **wait_for_selector** - Wait for element to appear
    - Parameters: `selector` (string), `timeout` (number, optional)

23. **wait_for_timeout** - Wait for specified time
    - Parameters: `timeout` (number, milliseconds)

### Screenshots & PDFs
24. **screenshot** - Take a screenshot
    - Parameters: `name` (string, optional), `fullPage` (boolean, optional)

25. **pdf** - Generate a PDF of the page
    - Parameters: `name` (string, optional)

### Cookies
26. **get_cookies** - Get all cookies

27. **set_cookie** - Set a cookie
    - Parameters: `name` (string), `value` (string), `domain` (optional), `path` (optional)

28. **delete_cookies** - Delete all cookies

### JavaScript Execution
29. **evaluate** - Execute JavaScript in browser context
    - Parameters: `script` (string)

### Viewport
30. **set_viewport** - Set browser viewport size
    - Parameters: `width` (number), `height` (number)

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Run Locally (stdio mode)

```bash
SERVER_MODE=stdio npm start
```

### Run Locally (HTTP mode)

```bash
npm start
# Server will run on http://localhost:3000
```

## Deployment to Render

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Deploy**
   - Render will automatically build and deploy your service
   - The service will be available at your Render URL

### Option 2: Manual Deployment with render.yaml

1. **Install Render CLI** (optional)
   ```bash
   npm install -g render-cli
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Choose "Deploy from Git" or "Deploy an existing image"
   - Configure using the provided `render.yaml`

3. **Configuration Details**
   The `render.yaml` file includes:
   - Docker-based deployment
   - Health check endpoint at `/health`
   - Environment variables for production mode
   - Auto-deployment enabled

### Testing Your Deployment

Once deployed, you can test your Render service:

```bash
# Health check
curl https://your-app.onrender.com/health

# List available tools
curl https://your-app.onrender.com/tools

# Execute a tool (example: navigate)
curl -X POST https://your-app.onrender.com/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "navigate",
    "arguments": {
      "url": "https://example.com"
    }
  }'

# Take a screenshot
curl -X POST https://your-app.onrender.com/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "screenshot",
    "arguments": {
      "name": "example",
      "fullPage": true
    }
  }'
```

## Web App Integration

Yes! Your web app can communicate with the deployed Playwright MCP server via HTTP API calls. The server includes:

- **CORS Support**: Configure allowed origins for cross-domain requests
- **API Key Authentication**: Secure your endpoints with API key authentication
- **JSON API**: Easy-to-use REST API for all browser automation tools

### Getting Your API Key

After deploying to Render:
1. Go to your Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Find the `API_KEY` variable (Render auto-generates a secure key)
5. Copy this key to use in your web app

### Calling from Your Web App

#### JavaScript/Fetch Example

```javascript
const response = await fetch('https://your-app.onrender.com/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key-here'
  },
  body: JSON.stringify({
    tool: 'navigate',
    arguments: { url: 'https://example.com' }
  })
});

const result = await response.json();
console.log(result);
```

#### React Example

```tsx
const takeScreenshot = async (url: string) => {
  // First navigate
  await fetch('https://your-app.onrender.com/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.REACT_APP_PLAYWRIGHT_API_KEY
    },
    body: JSON.stringify({
      tool: 'navigate',
      arguments: { url }
    })
  });

  // Then screenshot
  const response = await fetch('https://your-app.onrender.com/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.REACT_APP_PLAYWRIGHT_API_KEY
    },
    body: JSON.stringify({
      tool: 'screenshot',
      arguments: { fullPage: true }
    })
  });

  const result = await response.json();
  const imageData = result.content.find(c => c.type === 'image')?.data;
  return `data:image/png;base64,${imageData}`;
};
```

See the `examples/` folder for complete integration examples:
- `web-app-integration.html` - Standalone HTML client
- `javascript-example.js` - Node.js/vanilla JS example
- `react-example.tsx` - React component example

## API Endpoints (HTTP Mode)

### GET /health
Health check endpoint (no authentication required)

**Response:**
```json
{
  "status": "ok",
  "service": "playwright-mcp-server"
}
```

### GET /tools
List all available tools (requires API key)

**Headers:**
```
X-API-Key: your-api-key-here
```

**Response:**
```json
{
  "tools": [...]
}
```

### POST /execute
Execute a tool (requires API key)

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key-here
```

**Request Body:**
```json
{
  "tool": "navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully navigated to https://example.com"
    }
  ]
}
```

## Environment Variables

- `SERVER_MODE`: Set to `http` for HTTP server mode, or `stdio` for MCP stdio mode (default: `http`)
- `PORT`: Port number for HTTP server (default: `3000`)
- `NODE_ENV`: Node environment (default: `production`)
- `API_KEY`: API key for authentication (auto-generated by Render, or set manually)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS, or `*` for all (default: `*`)
- `PLAYWRIGHT_BROWSERS_PATH`: Path to Playwright browsers (default: `/ms-playwright`)

### Security Notes

- **API Key**: Always set an API key in production. Render auto-generates one when you use `generateValue: true`
- **CORS**: For production, set `ALLOWED_ORIGINS` to your specific domain(s) instead of `*`
- **HTTPS**: Render provides HTTPS by default, always use HTTPS endpoints in production

## Docker

### Build the Docker image

```bash
docker build -t playwright-mcp-server .
```

### Run the Docker container

```bash
docker run -p 3000:3000 \
  -e SERVER_MODE=http \
  playwright-mcp-server
```

## Troubleshooting

### Browser fails to launch
- Ensure you have the necessary system dependencies for Playwright
- Check that the Chromium browser is properly installed
- Verify that the container has enough memory (at least 512MB recommended)

### Render deployment fails
- Check the build logs in Render dashboard
- Ensure `render.yaml` is in the root directory
- Verify that the Dockerfile is valid
- Check that environment variables are properly set

### Health check fails
- Ensure the `/health` endpoint is responding
- Check that the PORT environment variable matches Render's expected port
- Verify the service is listening on `0.0.0.0` not just `localhost`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

