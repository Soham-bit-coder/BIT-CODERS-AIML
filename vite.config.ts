import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import qrcode from 'qrcode-terminal';
import os from 'os';

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const localIP = getLocalIP();
    const port = 3000;
    
    return {
      server: {
        port,
        host: '0.0.0.0',
        strictPort: true,
      },
      plugins: [
        react(),
        {
          name: 'mobile-qr-code',
          configureServer(server) {
            server.httpServer?.once('listening', () => {
              const url = `http://${localIP}:${port}`;
              console.log('\n📱 Mobile Access:');
              console.log(`   Local:   http://localhost:${port}`);
              console.log(`   Network: ${url}`);
              console.log('\n📲 Scan QR Code with your phone:\n');
              qrcode.generate(url, { small: true });
              console.log('\n✨ Make sure your phone is on the same WiFi network!\n');
            });
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
