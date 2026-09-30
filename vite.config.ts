import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function getSmsApiKey(apiKey?: string): string {
  if (apiKey) return apiKey;
  if (process.env.FAST2SMS_API_KEY) return process.env.FAST2SMS_API_KEY;
  if (process.env.SMS_API_KEY) return process.env.SMS_API_KEY;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/FAST2SMS_API_KEY=([^\r\n]+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}
  return 'g6VRGQSHs3zLdJKNwj7kqvhPW48TeIicC2XZuUyoFpl1A5EBbnaVm9ABnUZ0sDFieNk5ydWI4KtTR12J';
}

function realSmsGatewayPlugin(): Plugin {
  return {
    name: 'real-sms-gateway-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-sms', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { phone, code, apiKey } = JSON.parse(body || '{}');
              const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
              const key = getSmsApiKey(apiKey);

              if (key) {
                try {
                  let provider = 'Fast2SMS';
                  const msgText = encodeURIComponent(`Your NestBasket 4-digit verification code is: ${code}. Valid for 10 minutes. Do not share this OTP.`);
                  let apiUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(key)}&route=q&message=${msgText}&language=english&flash=0&numbers=${cleanPhone}`;
                  if (key.length >= 30 && key.includes('-')) {
                    provider = '2Factor';
                    apiUrl = `https://2factor.in/v3/API/V1/${encodeURIComponent(key)}/SMS/${cleanPhone}/${code}/AUTOGEN`;
                  }
                  const fResponse = await fetch(apiUrl);
                  const fData = await fResponse.json();
                  res.end(JSON.stringify({ success: true, provider, data: fData, phone: `+91 ${cleanPhone}` }));
                  return;
                } catch (e: any) {
                  res.end(JSON.stringify({ success: false, error: e.message, phone: `+91 ${cleanPhone}` }));
                  return;
                }
              }

              res.end(JSON.stringify({
                success: false,
                telecomStatus: 'AWAITING_SMS_KEY',
                phone: `+91 ${cleanPhone}`,
                code: code,
                message: 'In India, TRAI mandates an approved DLT SMS Gateway (Fast2SMS/Twilio) to send cellular radio waves to mobile phones. Please add your SMS Gateway Key in Executive Portal.',
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), realSmsGatewayPlugin()],
  server: {
    port: 3000,
    open: false,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
