import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Local only (`pnpm dev`): answer /api/contact with the same function Vercel
 * runs, so the forms can be tested without logging in to Vercel.
 * Reads RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL from
 * apps/landing/.env.local (git-ignored). Not part of the production build.
 */
function contactApiDev(): Plugin {
  return {
    name: 'dll-contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          const env = loadEnv(server.config.mode, server.config.root, '')
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const request = new Request(`http://localhost${req.originalUrl ?? '/api/contact'}`, {
            method: req.method,
            headers: { 'content-type': String(req.headers['content-type'] ?? '') },
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          })
          const { handleContact } = await server.ssrLoadModule('/api/contact.ts')
          const response: Response = await handleContact(request, {
            RESEND_API_KEY: env.RESEND_API_KEY,
            CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL,
            CONTACT_FROM_EMAIL: env.CONTACT_FROM_EMAIL,
          })
          res.statusCode = response.status
          response.headers.forEach((value, name) => res.setHeader(name, value))
          res.end(await response.text())
        } catch (err) {
          server.config.logger.error(`[contact api] ${String(err)}`)
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, code: 'server_error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), contactApiDev()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})
