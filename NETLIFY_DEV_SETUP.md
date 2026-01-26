# Testing Netlify Functions in Development

## Setup Instructions

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
# or
npm install --save-dev netlify-cli
```

### 2. Login to Netlify (if you haven't already)

```bash
netlify login
```

### 3. Initialize Netlify in your project (if not already done)

```bash
netlify init
```

### 4. Set up environment variables for development

Create a `.env` file in your project root with your MailerLite credentials:

```env
MAILERLITE_API_TOKEN=your_actual_mailerlite_api_token_here
MAILERLITE_GROUP_ID=your_group_id_optional
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_SECONDS=600
```

### 5. Start development server with Netlify functions

Instead of using `npm run dev`, use:

```bash
netlify dev
```

This will:

- Start your Astro dev server
- Start the Netlify functions server
- Proxy requests between them
- Make functions available at
  `http://localhost:8888/.netlify/functions/subscribe`

## Testing the Newsletter Function

### Method 1: Use the Form on Your Site

1. Run `netlify dev`
2. Go to `http://localhost:8888` (or whatever port Netlify dev shows)
3. Navigate to a page with the newsletter form
4. Fill out the form and submit
5. Check the browser's Network tab to see the request/response
6. Check your MailerLite dashboard to see if the subscriber was added

### Method 2: Test with curl

```bash
# Test successful subscription
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Test validation error
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'

# Test honeypot (should return success but not actually subscribe)
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "hp": "spam"}'
```

### Method 3: Test with Postman or Insomnia

- URL: `http://localhost:8888/.netlify/functions/subscribe`
- Method: POST
- Headers: `Content-Type: application/json`
- Body: `{"email": "test@example.com", "name": "Test User"}`

## Expected Responses

### Success Response (200)

```json
{
  "ok": true,
  "message": "Successfully subscribed to newsletter!",
  "subscriber": {
    "id": "123456789",
    "email": "test@example.com",
    "status": "active"
  }
}
```

### Validation Error (400)

```json
{
  "ok": false,
  "error": "invalid_email",
  "message": "Please enter a valid email address."
}
```

### Already Subscribed (409)

```json
{
  "ok": false,
  "error": "already_subscribed",
  "message": "This email is already subscribed to our newsletter"
}
```

### Rate Limited (429)

```json
{
  "ok": false,
  "error": "rate_limited"
}
```

## Debugging Tips

### Check Function Logs

When running `netlify dev`, function logs will appear in your terminal. Look
for:

- Console.log statements from your function
- Error messages
- API responses from MailerLite

### Check Network Tab

In your browser's Developer Tools:

1. Open Network tab
2. Submit the form
3. Look for the request to `/.netlify/functions/subscribe`
4. Check the request payload and response

### Verify Environment Variables

Add this temporary debug endpoint to test your environment:

```typescript
// netlify/functions/debug.ts (temporary - remove before production)
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      hasToken: !!process.env.MAILERLITE_API_TOKEN,
      hasGroupId: !!process.env.MAILERLITE_GROUP_ID,
      nodeEnv: process.env.NODE_ENV,
    }),
  };
};
```

Then visit: `http://localhost:8888/.netlify/functions/debug`

## Common Issues

### Function Not Found (404)

- Make sure you're using `netlify dev` instead of `npm run dev`
- Check that the function file is in `netlify/functions/subscribe.ts`
- Verify the function exports a `handler`

### Environment Variables Not Working

- Make sure `.env` is in your project root
- Restart `netlify dev` after adding environment variables
- Check that variable names match exactly

### CORS Issues

- The function includes CORS headers, but if you're still having issues, try
  testing with curl first
- Make sure you're making requests to the same origin (localhost:8888)

### TypeScript Compilation Errors

- Netlify dev will show TypeScript errors in the terminal
- Fix any type errors before testing
- Make sure `@netlify/functions` is installed

## Production Testing

Once deployed to Netlify, the function will be available at:
`https://your-site-name.netlify.app/.netlify/functions/subscribe`

You can test it the same way, just replace the localhost URL with your
production URL.
