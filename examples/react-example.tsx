// Example: Using Playwright MCP Server in a React application

import React, { useState } from 'react';

const PLAYWRIGHT_SERVER_URL = process.env.REACT_APP_PLAYWRIGHT_SERVER_URL || 'https://your-app.onrender.com';
const API_KEY = process.env.REACT_APP_PLAYWRIGHT_API_KEY || '';

interface PlaywrightResponse {
  content: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

async function callPlaywrightTool(tool: string, args: Record<string, any>): Promise<PlaywrightResponse> {
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
}

export default function PlaywrightDemo() {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string>('');

  const handleNavigate = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await callPlaywrightTool('navigate', { url });
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = async () => {
    setLoading(true);
    setResult('');
    setScreenshot('');
    try {
      const response = await callPlaywrightTool('screenshot', { fullPage: true });
      setResult(JSON.stringify(response, null, 2));
      
      // Extract and display screenshot
      const imageContent = response.content.find(c => c.type === 'image');
      if (imageContent && imageContent.data) {
        setScreenshot(`data:image/png;base64,${imageContent.data}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetContent = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await callPlaywrightTool('get_content', {});
      const content = response.content[0]?.text || '';
      setResult(`Page content (${content.length} characters):\n${content.substring(0, 500)}...`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎭 Playwright MCP Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              width: '400px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleNavigate}
          disabled={loading}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Navigate
        </button>
        
        <button
          onClick={handleScreenshot}
          disabled={loading}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Take Screenshot
        </button>
        
        <button
          onClick={handleGetContent}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Get Content
        </button>
      </div>

      {loading && <p>⏳ Loading...</p>}

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          fontSize: '12px'
        }}>
          {result}
        </div>
      )}

      {screenshot && (
        <div style={{ marginTop: '20px' }}>
          <h3>Screenshot:</h3>
          <img
            src={screenshot}
            alt="Screenshot"
            style={{
              maxWidth: '100%',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
    </div>
  );
}

