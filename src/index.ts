import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium, Browser, Page } from "playwright";
import express from "express";
import cors from "cors";

// Browser instance management
let browser: Browser | null = null;
let page: Page | null = null;

async function ensureBrowser() {
  if (!browser) {
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
      });
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw new Error('Browser launch failed');
    }
  }
  return browser;
}

async function ensurePage() {
  try {
    await ensureBrowser();
    if (!page) {
      page = await browser!.newPage();
    }
    return page;
  } catch (error) {
    console.error('Failed to create page:', error);
    throw new Error('Page creation failed');
  }
}

// Define available tools
const tools: Tool[] = [
  {
    name: "navigate",
    description: "Navigate to a URL in the browser",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to navigate to",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "screenshot",
    description: "Take a screenshot of the current page",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the screenshot file",
          default: "screenshot",
        },
        fullPage: {
          type: "boolean",
          description: "Whether to take a full page screenshot",
          default: false,
        },
      },
    },
  },
  {
    name: "click",
    description: "Click an element on the page",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element to click",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "fill",
    description: "Fill a form field with text",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the input field",
        },
        value: {
          type: "string",
          description: "Text to fill in the field",
        },
      },
      required: ["selector", "value"],
    },
  },
  {
    name: "select",
    description: "Select an option from a dropdown",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the select element",
        },
        value: {
          type: "string",
          description: "Value to select",
        },
      },
      required: ["selector", "value"],
    },
  },
  {
    name: "hover",
    description: "Hover over an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element to hover",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "evaluate",
    description: "Execute JavaScript code in the browser context",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "JavaScript code to execute",
        },
      },
      required: ["script"],
    },
  },
  {
    name: "get_content",
    description: "Get the HTML content of the current page",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_text",
    description: "Get the text content of an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "get_attribute",
    description: "Get an attribute value from an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element",
        },
        attribute: {
          type: "string",
          description: "Attribute name to get",
        },
      },
      required: ["selector", "attribute"],
    },
  },
  {
    name: "wait_for_selector",
    description: "Wait for an element to appear on the page",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector to wait for",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds",
          default: 30000,
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "wait_for_timeout",
    description: "Wait for a specified amount of time",
    inputSchema: {
      type: "object",
      properties: {
        timeout: {
          type: "number",
          description: "Time to wait in milliseconds",
        },
      },
      required: ["timeout"],
    },
  },
  {
    name: "press_key",
    description: "Press a keyboard key",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element (optional, uses page if not provided)",
        },
        key: {
          type: "string",
          description: "Key to press (e.g., 'Enter', 'ArrowDown', 'a')",
        },
      },
      required: ["key"],
    },
  },
  {
    name: "type_text",
    description: "Type text character by character (simulates real typing)",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the input field",
        },
        text: {
          type: "string",
          description: "Text to type",
        },
        delay: {
          type: "number",
          description: "Delay between key presses in milliseconds",
          default: 0,
        },
      },
      required: ["selector", "text"],
    },
  },
  {
    name: "check",
    description: "Check a checkbox or radio button",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the checkbox/radio",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "uncheck",
    description: "Uncheck a checkbox",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the checkbox",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "get_title",
    description: "Get the page title",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_url",
    description: "Get the current page URL",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "go_back",
    description: "Navigate back in browser history",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "go_forward",
    description: "Navigate forward in browser history",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "reload",
    description: "Reload the current page",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_cookies",
    description: "Get all cookies for the current page",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "set_cookie",
    description: "Set a cookie",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Cookie name",
        },
        value: {
          type: "string",
          description: "Cookie value",
        },
        domain: {
          type: "string",
          description: "Cookie domain (optional)",
        },
        path: {
          type: "string",
          description: "Cookie path (optional)",
        },
      },
      required: ["name", "value"],
    },
  },
  {
    name: "delete_cookies",
    description: "Delete all cookies",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "pdf",
    description: "Generate a PDF of the current page",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "PDF filename",
          default: "page.pdf",
        },
      },
    },
  },
  {
    name: "is_visible",
    description: "Check if an element is visible",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "is_enabled",
    description: "Check if an element is enabled",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "is_checked",
    description: "Check if a checkbox or radio button is checked",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector for the element",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "count_elements",
    description: "Count the number of elements matching a selector",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "set_viewport",
    description: "Set the browser viewport size",
    inputSchema: {
      type: "object",
      properties: {
        width: {
          type: "number",
          description: "Viewport width in pixels",
        },
        height: {
          type: "number",
          description: "Viewport height in pixels",
        },
      },
      required: ["width", "height"],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: "playwright-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    // Ensure args is defined
    if (!args) {
      throw new Error("Arguments are required for tool execution");
    }

    switch (name) {
      case "navigate": {
        try {
          const p = await ensurePage();
          await p.goto(args.url as string, { waitUntil: "networkidle" });
          return {
            content: [
              {
                type: "text",
                text: `Successfully navigated to ${args.url}`,
              },
            ],
          };
        } catch (error) {
          throw new Error(`Navigation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      case "screenshot": {
        const p = await ensurePage();
        const screenshotName = (args.name as string) || "screenshot";
        const fullPage = (args.fullPage as boolean) || false;
        const buffer = await p.screenshot({ fullPage });
        return {
          content: [
            {
              type: "text",
              text: `Screenshot taken: ${screenshotName}.png`,
            },
            {
              type: "image",
              data: buffer.toString("base64"),
              mimeType: "image/png",
            },
          ],
        };
      }

      case "click": {
        const p = await ensurePage();
        await p.click(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: `Clicked element: ${args.selector}`,
            },
          ],
        };
      }

      case "fill": {
        const p = await ensurePage();
        await p.fill(args.selector as string, args.value as string);
        return {
          content: [
            {
              type: "text",
              text: `Filled ${args.selector} with value`,
            },
          ],
        };
      }

      case "select": {
        const p = await ensurePage();
        await p.selectOption(args.selector as string, args.value as string);
        return {
          content: [
            {
              type: "text",
              text: `Selected ${args.value} in ${args.selector}`,
            },
          ],
        };
      }

      case "hover": {
        const p = await ensurePage();
        await p.hover(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: `Hovered over ${args.selector}`,
            },
          ],
        };
      }

      case "evaluate": {
        const p = await ensurePage();
        const result = await p.evaluate((script) => {
          return eval(script);
        }, args.script as string);
        return {
          content: [
            {
              type: "text",
              text: `Script executed. Result: ${JSON.stringify(result)}`,
            },
          ],
        };
      }

      case "get_content": {
        const p = await ensurePage();
        const content = await p.content();
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "get_text": {
        const p = await ensurePage();
        const text = await p.textContent(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: text || "",
            },
          ],
        };
      }

      case "get_attribute": {
        const p = await ensurePage();
        const value = await p.getAttribute(args.selector as string, args.attribute as string);
        return {
          content: [
            {
              type: "text",
              text: value || "",
            },
          ],
        };
      }

      case "wait_for_selector": {
        const p = await ensurePage();
        const timeout = (args.timeout as number) || 30000;
        await p.waitForSelector(args.selector as string, { timeout });
        return {
          content: [
            {
              type: "text",
              text: `Element ${args.selector} appeared`,
            },
          ],
        };
      }

      case "wait_for_timeout": {
        const p = await ensurePage();
        await p.waitForTimeout(args.timeout as number);
        return {
          content: [
            {
              type: "text",
              text: `Waited ${args.timeout}ms`,
            },
          ],
        };
      }

      case "press_key": {
        const p = await ensurePage();
        if (args.selector) {
          await p.press(args.selector as string, args.key as string);
        } else {
          await p.keyboard.press(args.key as string);
        }
        return {
          content: [
            {
              type: "text",
              text: `Pressed key: ${args.key}`,
            },
          ],
        };
      }

      case "type_text": {
        const p = await ensurePage();
        const delay = (args.delay as number) || 0;
        await p.type(args.selector as string, args.text as string, { delay });
        return {
          content: [
            {
              type: "text",
              text: `Typed text into ${args.selector}`,
            },
          ],
        };
      }

      case "check": {
        const p = await ensurePage();
        await p.check(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: `Checked ${args.selector}`,
            },
          ],
        };
      }

      case "uncheck": {
        const p = await ensurePage();
        await p.uncheck(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: `Unchecked ${args.selector}`,
            },
          ],
        };
      }

      case "get_title": {
        const p = await ensurePage();
        const title = await p.title();
        return {
          content: [
            {
              type: "text",
              text: title,
            },
          ],
        };
      }

      case "get_url": {
        const p = await ensurePage();
        const url = p.url();
        return {
          content: [
            {
              type: "text",
              text: url,
            },
          ],
        };
      }

      case "go_back": {
        const p = await ensurePage();
        await p.goBack();
        return {
          content: [
            {
              type: "text",
              text: "Navigated back",
            },
          ],
        };
      }

      case "go_forward": {
        const p = await ensurePage();
        await p.goForward();
        return {
          content: [
            {
              type: "text",
              text: "Navigated forward",
            },
          ],
        };
      }

      case "reload": {
        const p = await ensurePage();
        await p.reload();
        return {
          content: [
            {
              type: "text",
              text: "Page reloaded",
            },
          ],
        };
      }

      case "get_cookies": {
        const p = await ensurePage();
        const cookies = await p.context().cookies();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(cookies, null, 2),
            },
          ],
        };
      }

      case "set_cookie": {
        const p = await ensurePage();
        const cookie: any = {
          name: args.name as string,
          value: args.value as string,
          url: p.url(),
        };
        if (args.domain) cookie.domain = args.domain;
        if (args.path) cookie.path = args.path;
        await p.context().addCookies([cookie]);
        return {
          content: [
            {
              type: "text",
              text: `Cookie ${args.name} set`,
            },
          ],
        };
      }

      case "delete_cookies": {
        const p = await ensurePage();
        await p.context().clearCookies();
        return {
          content: [
            {
              type: "text",
              text: "All cookies deleted",
            },
          ],
        };
      }

      case "pdf": {
        const p = await ensurePage();
        const pdfName = (args.name as string) || "page.pdf";
        const buffer = await p.pdf({ format: 'A4' });
        return {
          content: [
            {
              type: "text",
              text: `PDF generated: ${pdfName}`,
            },
            {
              type: "resource",
              resource: {
                uri: `data:application/pdf;base64,${buffer.toString("base64")}`,
                mimeType: "application/pdf",
                text: buffer.toString("base64"),
              },
            },
          ],
        };
      }

      case "is_visible": {
        const p = await ensurePage();
        const visible = await p.isVisible(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: visible.toString(),
            },
          ],
        };
      }

      case "is_enabled": {
        const p = await ensurePage();
        const enabled = await p.isEnabled(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: enabled.toString(),
            },
          ],
        };
      }

      case "is_checked": {
        const p = await ensurePage();
        const checked = await p.isChecked(args.selector as string);
        return {
          content: [
            {
              type: "text",
              text: checked.toString(),
            },
          ],
        };
      }

      case "count_elements": {
        const p = await ensurePage();
        const count = await p.locator(args.selector as string).count();
        return {
          content: [
            {
              type: "text",
              text: count.toString(),
            },
          ],
        };
      }

      case "set_viewport": {
        const p = await ensurePage();
        await p.setViewportSize({
          width: args.width as number,
          height: args.height as number,
        });
        return {
          content: [
            {
              type: "text",
              text: `Viewport set to ${args.width}x${args.height}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  // Check if we should run in HTTP mode (for Render) or stdio mode (for local MCP)
  const mode = process.env.SERVER_MODE || "http";
  
  if (mode === "http") {
    // HTTP mode for Render deployment
    const app = express();
    
    // CORS configuration
    const corsOptions = {
      origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'X-API-Key'],
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    
    // API Key authentication middleware
    const apiKeyAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const apiKey = process.env.API_KEY;
      
      // Skip auth for health check
      if (req.path === '/health') {
        return next();
      }
      
      // If API_KEY is not set, skip authentication (not recommended for production)
      if (!apiKey) {
        console.warn('Warning: API_KEY not set. Authentication is disabled.');
        return next();
      }
      
      const providedKey = req.headers['x-api-key'];
      
      if (!providedKey || providedKey !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
      }
      
      next();
    };
    
    app.use(apiKeyAuth);
    
    // Health check endpoint (no auth required)
    app.get("/health", (req, res) => {
      res.json({ status: "ok", service: "playwright-mcp-server" });
    });
    
    // List available tools
    app.get("/tools", async (req, res) => {
      res.json({ tools });
    });
    
    // Execute a tool
    app.post("/execute", async (req, res) => {
      try {
        const { tool, arguments: args } = req.body;
        
        if (!tool) {
          return res.status(400).json({ error: "Tool name is required" });
        }
        
        const result = await server.request(
          { method: "tools/call", params: { name: tool, arguments: args } },
          CallToolRequestSchema
        );
        
        res.json(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
      }
    });
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Playwright MCP Server running on HTTP port ${port}`);
    });
  } else {
    // Stdio mode for local MCP usage
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Playwright MCP Server running on stdio");
  }
}

// Handle cleanup on exit
process.on("SIGINT", async () => {
  if (page) await page.close();
  if (browser) await browser.close();
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

