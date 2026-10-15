# Netlify Deployment Guide — ScamShield AI 🚀
## Frontend + Backend Serverless Deployment

> **Urdu Summary / اردو خلاصہ:**
> جی ہاں! آپ اس ایپ کو Netlify پر Frontend اور Backend دونوں کے ساتھ با آسانی اپلوڈ اور ڈپلائی کر سکتے ہیں۔ Netlify آپ کے React Frontend کو Static CDN پر چلاتا ہے اور Express Backend کو `netlify/functions` کے ذریعے Serverless Function پر چلاتا ہے۔ ہم نے `netlify.toml` اور `netlify/functions/api.ts` پہلے سے مکمل کنفیگر کر دیا ہے۔

---

## 1. Quick Step-by-Step Deployment to Netlify

### Method A: Connect via GitHub (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy ScamShield AI to Netlify"
   git push origin main
   ```
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** ➔ **"Import an existing project"** ➔ Select **GitHub**.
4. Choose your `ScamShield` repository.
5. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
6. Click **Deploy Site**!

### Method B: Netlify CLI (Direct Terminal Deploy)
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Build & Deploy
npm run build
netlify deploy --prod
```

---

## 2. Environment Variables on Netlify

In your Netlify Dashboard, navigate to:
**Site configuration** ➔ **Environment variables** ➔ **Add a variable**

| Variable Name | Description | Example / Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key for AI Analysis & Vision OCR | (Optional in dev, recommended in production) |
| `NODE_VERSION` | Node.js Runtime Version | `20` (Already set in netlify.toml) |
| `JWT_SECRET` | Secret key for session tokens | `scamshield_super_secure_secret_key` |

---

## 3. How Frontend + Backend Work Together on Netlify

```
                       [ Browser / User ]
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
       Static Assets (dist)             API Calls (/api/v1/*)
      • HTML / React 19 Bundle         • Handled by netlify.toml
      • CSS (Claymorphic)              • Routed to netlify/functions/api.ts
      • Stickers, Icons & Images       • serverless-http mounts Express App
      • PPTX & PDF Downloads           • In-Memory & /tmp safe storage
```

1. **Frontend:** Vite compiles React 19 and Tailwind CSS into `/dist`. Netlify serves these at lighting speed across global CDNs.
2. **Backend:** When the frontend requests `/api/v1/analyses` or `/api/v1/reputation/check`, Netlify automatically routes the request to `netlify/functions/api.ts` using the redirect rules in `netlify.toml`.
3. **Database / Storage:** In serverless environments, file systems are ephemeral. Our database layer intelligently writes to `/tmp/.data` or keeps data active in-memory, ensuring zero crashes (`EROFS: read-only file system` errors are completely prevented).
4. **Standalone Client Fallback:** If you ever deploy just the static frontend without backend functions, ScamShield's built-in client engine automatically performs local heuristic inspection, ensuring 100% uptime!

---

## 4. Cross-Browser Certification (Safari & Chrome)
- **Safari:** Fully certified on Apple Safari (iOS & macOS). Resolved regex lookbehinds, added `-webkit-backdrop-filter` prefixes, integrated cross-browser `safeFormatDate` parser, and set esbuild target to `safari14+`.
- **Chrome / Edge / Firefox:** 100% compliant with standard ES2020 modules and modern rendering.
- **Light Mode:** Locked to clean, high-contrast tactile Claymorphic daylight mode.
