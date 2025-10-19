# ChatKit Nuxt Integration

A production-ready integration of OpenAI ChatKit with Nuxt 3, using the OpenAI hosted backend with Agent Builder workflows.

## Features

- 🚀 **OpenAI Hosted Backend** - Leverages OpenAI's Agent Builder for workflow management
- 🎨 **Custom Theming** - Dark mode UI with OpenAI Sans typography
- 📱 **Responsive Design** - Full-screen chat experience optimized for all devices
- 🔒 **Domain-Based Authentication** - Simple public-key authentication (no backend required)
- 📎 **File Attachments** - Support for up to 5 file attachments per message (10MB max)

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Published Agent Builder workflow

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your values:

```env
NUXT_PUBLIC_WORKFLOW_ID=wf_your-workflow-id-here
NUXT_PUBLIC_DOMAIN_KEY=domain_pk_your-public-key-here
```

**Note:** This implementation uses the public-key approach, so no OpenAI API key is needed!

**Getting your Workflow ID:**

1. Go to [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Create or select your workflow
3. Click "Publish"
4. Copy the workflow ID (starts with `wf_`)

### 3. Add Domain to Allowlist and Get Public Key

⚠️ **CRITICAL STEP** - ChatKit requires your domain to be allowlisted:

1. Go to [Domain Allowlist Settings](https://platform.openai.com/settings/organization/allowlist)
2. Click "Add Domain"
3. For **development**: Add `localhost:3000` or your dev domain
4. For **production**: Add your production domain (e.g., `yourdomain.com`)
5. **Copy the public key** that OpenAI provides (starts with `domain_pk_`)
6. Add the public key to your `.env` file as `NUXT_PUBLIC_DOMAIN_KEY`

**Note:** Don't include `http://` or `https://` in the domain - just the domain and port.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see the ChatKit interface.

**Important:** If testing locally, you'll need to use a tunneling service (like Cloudflare Tunnel or ngrok) to get a public URL that matches your allowlisted domain.

## Deployment

### Production Checklist

Before deploying to production:

- [ ] Add production domain to OpenAI allowlist
- [ ] Copy the public key from OpenAI
- [ ] Set `NUXT_PUBLIC_WORKFLOW_ID` in your hosting provider's environment variables
- [ ] Set `NUXT_PUBLIC_DOMAIN_KEY` in your hosting provider's environment variables
- [ ] Test the workflow in Agent Builder preview mode

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
core/
├── components/
│   └── ChatKit.vue          # Main ChatKit component (with public key)
├── pages/
│   └── index.vue            # Main page with full-screen chat
├── layouts/
│   └── default.vue          # Minimal layout wrapper
├── assets/
│   └── css/
│       └── main.css         # Global styles
├── nuxt.config.ts           # Nuxt configuration
└── .env                     # Environment variables (not in git)
```

## Configuration

### ChatKit Component

The ChatKit component (`components/ChatKit.vue`) can be customized with:

- **Theme**: Color scheme, radius, density, typography
- **Composer**: Attachments settings, tools configuration
- **Start Screen**: Custom greeting and prompt suggestions

See the [ChatKit documentation](https://github.com/openai/chatkit-js) for all available options.

### Authentication

This implementation uses **public-key authentication**:

- Domain key configured via environment variable (`NUXT_PUBLIC_DOMAIN_KEY`)
- No backend authentication required
- Validated by OpenAI based on your allowlisted domain

## Troubleshooting

### Blank Screen

**Symptom:** Page loads but ChatKit doesn't appear

**Solution:**

1. Check browser console for errors (F12)
2. Verify domain is in OpenAI allowlist
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. Check that session endpoint returns a valid `client_secret`

### Session Creation Fails

**Symptom:** Network errors or 401/403 responses

**Solution:**

1. Verify your domain is in the OpenAI allowlist
2. Check that `NUXT_PUBLIC_DOMAIN_KEY` matches the public key from OpenAI
3. Ensure `NUXT_PUBLIC_WORKFLOW_ID` matches exactly
4. Confirm workflow is published in Agent Builder

### Messages Don't Send

**Symptom:** Chat loads but messages fail

**Solution:**

1. Test workflow directly in Agent Builder
2. Check workflow has response configured
3. Review workflow logs in Agent Builder
4. Verify domain is in allowlist

## Tech Stack

- **Nuxt 3** - Vue framework for SSR and static generation
- **ChatKit Vue** - Vue 3 bindings for OpenAI ChatKit
- **TailwindCSS** - Utility-first CSS framework
- **PrimeVue** - UI component library
- **TypeScript** - Type-safe development

## Resources

- [ChatKit Documentation](https://github.com/openai/chatkit-js)
- [Agent Builder](https://platform.openai.com/agent-builder)
- [Domain Allowlist Settings](https://platform.openai.com/settings/organization/allowlist)
- [OpenAI API Keys](https://platform.openai.com/api-keys)

## License

MIT

---

**Note:** This implementation uses the OpenAI hosted backend approach. For self-hosted implementations with custom backends, see the [advanced integration docs](https://platform.openai.com/docs/chatkit/advanced).
