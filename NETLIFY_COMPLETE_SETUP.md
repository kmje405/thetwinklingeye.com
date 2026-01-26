# Complete Netlify Setup Guide

## Current Status ✅

Your project already has:

- ✅ `netlify/functions/subscribe.ts` - MailerLite function
- ✅ `netlify.toml` - Configuration file (Node 20)
- ✅ `@netlify/functions` package installed

## Step 1: Install Netlify CLI

Check if you have it installed:

```bash
netlify --version
```

If not installed, install it:

```bash
npm install -g netlify-cli
```

## Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate with Netlify.

## Step 3: Initialize Your Project

### Option A: Link to Existing Netlify Site

If you already have a Netlify site:

```bash
netlify link
```

Then select your existing site.

### Option B: Create New Netlify Site

If you don't have a site yet:

```bash
netlify init
```

Follow the prompts to create a new site.

## Step 4: Set Up Environment Variables

### For Local Development

Add to your `.env` file:

```env
MAILERLITE_API_TOKEN=your_actual_mailerlite_api_token_here
MAILERLITE_GROUP_ID=your_group_id_optional
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_SECONDS=600
```

### For Production (Netlify Dashboard)

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add these variables:
   - `MAILERLITE_API_TOKEN` = your MailerLite API token
   - `MAILERLITE_GROUP_ID` = your group ID (optional)

## Step 5: Test Locally

Start the development server with Netlify functions:

```bash
netlify dev
```

This will:

- Start your Astro site (usually at `http://localhost:8888`)
- Enable functions at `/.netlify/functions/subscribe`
- Load your environment variables

## Step 6: Test the Newsletter Function

### Method 1: Use the Form

1. Go to `http://localhost:8888`
2. Find the newsletter form
3. Fill it out and submit
4. Check browser Network tab for the request/response

### Method 2: Test with curl

```bash
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## Step 7: Deploy to Production

### Option A: Git-based Deployment (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. In Netlify dashboard, connect your repository
3. Netlify will automatically deploy on every push

### Option B: Manual Deployment

```bash
netlify deploy --prod
```

## Verification Checklist

### Local Development ✓

- [ ] `netlify dev` starts without errors
- [ ] Site loads at `http://localhost:8888`
- [ ] Newsletter form submits successfully
- [ ] Function logs appear in terminal
- [ ] MailerLite receives the subscription

### Production ✓

- [ ] Site deploys successfully
- [ ] Environment variables are set in Netlify dashboard
- [ ] Newsletter form works on live site
- [ ] Function logs appear in Netlify dashboard

## Troubleshooting

### "netlify: command not found"

Install the CLI globally:

```bash
npm install -g netlify-cli
```

### "Function not found" (404)

- Make sure you're using `netlify dev` not `npm run dev`
- Check that `netlify.toml` exists in project root
- Verify function is in `netlify/functions/subscribe.ts`

### Environment Variables Not Working

- Restart `netlify dev` after adding variables to `.env`
- For production, check Netlify dashboard → Site settings → Environment
  variables
- Variable names are case-sensitive

### TypeScript Errors

- Make sure `@netlify/functions` is installed
- Check that imports use `import type` for types
- Run `npm run build` to check for compilation errors

### MailerLite API Errors

- Verify your API token is correct
- Check MailerLite dashboard for API usage/errors
- Test with a simple curl request first

## Next Steps

1. **Get MailerLite API Token**:
   - Go to MailerLite dashboard
   - Navigate to Integrations → API
   - Generate a new API token
   - Add it to your environment variables

2. **Optional: Set up Group**:
   - Create a group in MailerLite
   - Get the group ID
   - Add `MAILERLITE_GROUP_ID` to environment variables

3. **Test Everything**:
   - Test locally with `netlify dev`
   - Deploy to production
   - Test the live form

## File Structure

Your project should now have:

```
├── netlify/
│   └── functions/
│       └── subscribe.ts
├── netlify.toml
├── .env (local only)
├── .env.example
└── NETLIFY_COMPLETE_SETUP.md (this file)
```

## Support

- Netlify Functions: https://docs.netlify.com/functions/overview/
- MailerLite API: https://developers.mailerlite.com/
- Astro + Netlify: https://docs.astro.build/en/guides/deploy/netlify/
