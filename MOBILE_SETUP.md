# 📱 Mobile Access Guide for NutriVision AI

## Quick Start

### 1️⃣ Start the Development Server
```bash
npm run dev
```

### 2️⃣ Look for the QR Code in Terminal
You'll see something like this:
```
📱 Mobile Access:
   Local:   http://localhost:3000
   Network: http://192.168.1.105:3000

📲 Scan QR Code with your phone:

█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▄▀▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀ ▄█ █   █ ████
████ █▄▄▄█ █▀ █▀▀█▄▀█ █▄▄▄█ ████
...

✨ Make sure your phone is on the same WiFi network!
```

### 3️⃣ Connect from Your Phone
**Option A:** Scan the QR code with your phone's camera
**Option B:** Manually type the Network URL in your mobile browser

---

## 🔧 Troubleshooting

### Can't Connect?

1. **Check WiFi Network**
   - Your phone and computer MUST be on the same WiFi
   - Don't use mobile data or different networks

2. **Firewall Issues**
   - Windows Firewall might block the connection
   - Allow Node.js through firewall when prompted

3. **Find Your IP Manually**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your WiFi adapter

4. **Try Different Port**
   If port 3000 is blocked, edit `vite.config.ts`:
   ```typescript
   server: {
     port: 5173, // Change this
     host: '0.0.0.0',
   }
   ```

---

## 📸 Mobile Features

### Camera Access
The app uses your phone's camera for:
- **Food Scanning** - Take photos of meals for AI analysis
- **Barcode Scanning** - Scan product barcodes for nutrition info

### Mobile-Optimized UI
- Responsive design works on all screen sizes
- Touch-friendly buttons and gestures
- Bottom navigation on mobile
- Optimized camera controls

---

## 🚀 Advanced: Deploy for Remote Access

### Option 1: Ngrok (Easiest)
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose it
ngrok http 3000
```
You'll get a public URL like `https://abc123.ngrok.io`

### Option 2: Deploy to Vercel/Netlify
For permanent hosting:
```bash
# Build the app
npm run build

# Deploy to Vercel
npx vercel

# Or deploy to Netlify
npx netlify deploy
```

---

## 💡 Tips

1. **Save to Home Screen** (iOS/Android)
   - Open the app in mobile browser
   - Tap "Share" → "Add to Home Screen"
   - Now it works like a native app!

2. **Enable Camera Permissions**
   - Browser will ask for camera access
   - Make sure to "Allow" for scanning features

3. **Use HTTPS for Camera** (Production)
   - Camera only works on HTTPS or localhost
   - Use ngrok or deploy to get HTTPS

4. **Offline Mode**
   - Add a service worker for offline functionality
   - Cache scanned meals locally

---

## 🎯 What Works on Mobile

✅ Food scanning with camera
✅ Barcode scanning
✅ AI chatbot
✅ Meal history
✅ Progress tracking
✅ Fitness integration
✅ Meal recommendations
✅ All charts and visualizations

---

## 🔐 Security Note

When using network access:
- Only devices on your local network can access the app
- Your Gemini API key is safe (not exposed to network)
- For production, use proper authentication
- Don't expose your dev server to the internet without security

---

## 📞 Need Help?

If you're still having issues:
1. Check that both devices are on the same WiFi
2. Restart the dev server
3. Try accessing from desktop first to verify it works
4. Check browser console for errors (F12)
5. Disable VPN if you're using one

Happy scanning! 🎉
