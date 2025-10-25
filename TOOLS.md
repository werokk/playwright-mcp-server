# Playwright MCP Server - Complete Tool Reference

This document provides detailed documentation for all 30 available tools in the Playwright MCP Server.

## Navigation & Page Control

### `navigate`
Navigate to a URL in the browser.

**Parameters:**
- `url` (string, required): The URL to navigate to

**Example:**
```json
{
  "tool": "navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
```

### `go_back`
Navigate back in browser history.

**Parameters:** None

### `go_forward`
Navigate forward in browser history.

**Parameters:** None

### `reload`
Reload the current page.

**Parameters:** None

### `get_url`
Get the current page URL.

**Parameters:** None

**Returns:** Current URL as string

### `get_title`
Get the page title.

**Parameters:** None

**Returns:** Page title as string

---

## Element Interactions

### `click`
Click an element on the page.

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Example:**
```json
{
  "tool": "click",
  "arguments": {
    "selector": "button#submit"
  }
}
```

### `fill`
Fill a form field with text. Clears the field first, then types the value.

**Parameters:**
- `selector` (string, required): CSS selector for the input field
- `value` (string, required): Text to fill

**Example:**
```json
{
  "tool": "fill",
  "arguments": {
    "selector": "input[name='email']",
    "value": "user@example.com"
  }
}
```

### `select`
Select an option from a dropdown.

**Parameters:**
- `selector` (string, required): CSS selector for the select element
- `value` (string, required): Value of the option to select

**Example:**
```json
{
  "tool": "select",
  "arguments": {
    "selector": "select#country",
    "value": "USA"
  }
}
```

### `hover`
Hover the mouse over an element.

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Example:**
```json
{
  "tool": "hover",
  "arguments": {
    "selector": ".dropdown-trigger"
  }
}
```

### `check`
Check a checkbox or radio button.

**Parameters:**
- `selector` (string, required): CSS selector for the checkbox/radio

**Example:**
```json
{
  "tool": "check",
  "arguments": {
    "selector": "input[type='checkbox']#terms"
  }
}
```

### `uncheck`
Uncheck a checkbox.

**Parameters:**
- `selector` (string, required): CSS selector for the checkbox

---

## Keyboard Actions

### `press_key`
Press a keyboard key. Can be used on a specific element or on the page.

**Parameters:**
- `key` (string, required): Key to press (e.g., 'Enter', 'Tab', 'ArrowDown', 'a', 'Control+C')
- `selector` (string, optional): CSS selector for the element to press the key on

**Examples:**
```json
// Press Enter on the page
{
  "tool": "press_key",
  "arguments": {
    "key": "Enter"
  }
}

// Press Tab on a specific input
{
  "tool": "press_key",
  "arguments": {
    "selector": "input#username",
    "key": "Tab"
  }
}
```

### `type_text`
Type text character by character, simulating real typing.

**Parameters:**
- `selector` (string, required): CSS selector for the input field
- `text` (string, required): Text to type
- `delay` (number, optional): Delay between key presses in milliseconds (default: 0)

**Example:**
```json
{
  "tool": "type_text",
  "arguments": {
    "selector": "input#search",
    "text": "playwright automation",
    "delay": 100
  }
}
```

---

## Element Information

### `get_text`
Get the text content of an element.

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Returns:** Text content as string

**Example:**
```json
{
  "tool": "get_text",
  "arguments": {
    "selector": "h1.title"
  }
}
```

### `get_attribute`
Get an attribute value from an element.

**Parameters:**
- `selector` (string, required): CSS selector for the element
- `attribute` (string, required): Attribute name to get

**Returns:** Attribute value as string

**Example:**
```json
{
  "tool": "get_attribute",
  "arguments": {
    "selector": "a#download-link",
    "attribute": "href"
  }
}
```

### `get_content`
Get the full HTML content of the current page.

**Parameters:** None

**Returns:** HTML content as string

### `is_visible`
Check if an element is visible on the page.

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Returns:** Boolean (true/false) as string

### `is_enabled`
Check if an element is enabled (not disabled).

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Returns:** Boolean (true/false) as string

### `is_checked`
Check if a checkbox or radio button is checked.

**Parameters:**
- `selector` (string, required): CSS selector for the element

**Returns:** Boolean (true/false) as string

### `count_elements`
Count the number of elements matching a selector.

**Parameters:**
- `selector` (string, required): CSS selector

**Returns:** Count as string

**Example:**
```json
{
  "tool": "count_elements",
  "arguments": {
    "selector": "li.product-item"
  }
}
```

---

## Waiting & Timing

### `wait_for_selector`
Wait for an element to appear on the page.

**Parameters:**
- `selector` (string, required): CSS selector to wait for
- `timeout` (number, optional): Timeout in milliseconds (default: 30000)

**Example:**
```json
{
  "tool": "wait_for_selector",
  "arguments": {
    "selector": ".loading-complete",
    "timeout": 10000
  }
}
```

### `wait_for_timeout`
Wait for a specified amount of time.

**Parameters:**
- `timeout` (number, required): Time to wait in milliseconds

**Example:**
```json
{
  "tool": "wait_for_timeout",
  "arguments": {
    "timeout": 2000
  }
}
```

---

## Screenshots & PDFs

### `screenshot`
Take a screenshot of the current page.

**Parameters:**
- `name` (string, optional): Name for the screenshot file (default: "screenshot")
- `fullPage` (boolean, optional): Whether to capture the full scrollable page (default: false)

**Returns:** 
- Text message
- Base64-encoded PNG image

**Example:**
```json
{
  "tool": "screenshot",
  "arguments": {
    "name": "homepage",
    "fullPage": true
  }
}
```

### `pdf`
Generate a PDF of the current page.

**Parameters:**
- `name` (string, optional): PDF filename (default: "page.pdf")

**Returns:** 
- Text message
- Base64-encoded PDF

**Example:**
```json
{
  "tool": "pdf",
  "arguments": {
    "name": "invoice"
  }
}
```

---

## Cookies

### `get_cookies`
Get all cookies for the current page context.

**Parameters:** None

**Returns:** JSON array of cookie objects

**Example Response:**
```json
[
  {
    "name": "session_id",
    "value": "abc123",
    "domain": ".example.com",
    "path": "/",
    "expires": 1735689600,
    "httpOnly": true,
    "secure": true,
    "sameSite": "Lax"
  }
]
```

### `set_cookie`
Set a cookie for the current page.

**Parameters:**
- `name` (string, required): Cookie name
- `value` (string, required): Cookie value
- `domain` (string, optional): Cookie domain
- `path` (string, optional): Cookie path

**Example:**
```json
{
  "tool": "set_cookie",
  "arguments": {
    "name": "user_pref",
    "value": "dark_mode",
    "path": "/"
  }
}
```

### `delete_cookies`
Delete all cookies for the current context.

**Parameters:** None

---

## JavaScript Execution

### `evaluate`
Execute JavaScript code in the browser context.

**Parameters:**
- `script` (string, required): JavaScript code to execute

**Returns:** Result of the script execution as JSON string

**Examples:**
```json
// Get the page title
{
  "tool": "evaluate",
  "arguments": {
    "script": "document.title"
  }
}

// Get all link URLs
{
  "tool": "evaluate",
  "arguments": {
    "script": "Array.from(document.querySelectorAll('a')).map(a => a.href)"
  }
}

// Scroll to bottom
{
  "tool": "evaluate",
  "arguments": {
    "script": "window.scrollTo(0, document.body.scrollHeight)"
  }
}
```

---

## Viewport

### `set_viewport`
Set the browser viewport size.

**Parameters:**
- `width` (number, required): Viewport width in pixels
- `height` (number, required): Viewport height in pixels

**Example:**
```json
{
  "tool": "set_viewport",
  "arguments": {
    "width": 1920,
    "height": 1080
  }
}
```

---

## Common Workflows

### Complete Form Submission
```javascript
// 1. Navigate to form
await execute("navigate", { url: "https://example.com/form" });

// 2. Fill fields
await execute("fill", { selector: "#email", value: "user@example.com" });
await execute("fill", { selector: "#password", value: "secret123" });

// 3. Check terms
await execute("check", { selector: "#terms" });

// 4. Submit
await execute("click", { selector: "button[type='submit']" });

// 5. Wait for success
await execute("wait_for_selector", { selector: ".success-message" });

// 6. Take screenshot
await execute("screenshot", { name: "form-submitted", fullPage: true });
```

### Web Scraping
```javascript
// 1. Navigate
await execute("navigate", { url: "https://example.com/products" });

// 2. Wait for content
await execute("wait_for_selector", { selector: ".product-list" });

// 3. Count products
const count = await execute("count_elements", { selector: ".product-item" });

// 4. Extract data with JavaScript
const data = await execute("evaluate", {
  script: `
    Array.from(document.querySelectorAll('.product-item')).map(item => ({
      title: item.querySelector('.title').textContent,
      price: item.querySelector('.price').textContent,
      url: item.querySelector('a').href
    }))
  `
});
```

### Testing Workflows
```javascript
// 1. Set mobile viewport
await execute("set_viewport", { width: 375, height: 667 });

// 2. Navigate
await execute("navigate", { url: "https://example.com" });

// 3. Check element visibility
const isVisible = await execute("is_visible", { selector: ".mobile-menu" });

// 4. Take screenshot
await execute("screenshot", { name: "mobile-view", fullPage: true });

// 5. Switch to desktop
await execute("set_viewport", { width: 1920, height: 1080 });
```

---

## Error Handling

All tools return an error response if something goes wrong:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Element not found: #invalid-selector"
    }
  ],
  "isError": true
}
```

Common errors:
- Element not found (selector doesn't match any element)
- Timeout exceeded (element didn't appear in time)
- Navigation failed (invalid URL or network error)
- Invalid selector (malformed CSS selector)

---

## Tips & Best Practices

1. **Use specific selectors**: Prefer IDs and unique class names over generic selectors
2. **Wait for dynamic content**: Use `wait_for_selector` before interacting with AJAX-loaded elements
3. **Handle timeouts**: Set appropriate timeouts for slow-loading pages
4. **Take screenshots**: Capture screenshots at key points for debugging
5. **Use evaluate wisely**: For complex data extraction, `evaluate` is more efficient than multiple queries
6. **Mobile testing**: Use `set_viewport` to test responsive designs
7. **Cookie management**: Manage authentication state with `get_cookies` and `set_cookie`

