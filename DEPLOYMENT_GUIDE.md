# CampusNova AI: Complete Deployment Guide
> **Cloud, Local Wi-Fi (Viva Demo), and Production Server Deployment**

---

## 📌 Deployment Options Summary

| Method | Best For | Cost | Difficulty |
|---|---|---|---|
| **Option 1: Local College Wi-Fi / Viva Demo** | Live college presentation (examiners test on phones) | **100% Free** | ⭐ Easy (5 mins) |
| **Option 2: Free Cloud Hosting (Render + Vercel)** | Free public live URL on the internet | **100% Free** | ⭐⭐ Easy (10 mins) |
| **Option 3: Docker & Docker Compose** | Turnkey containerized deployment | **Free** | ⭐⭐ Moderate |
| **Option 4: Production Cloud VPS (AWS EC2 / DigitalOcean / Nginx)** | Full institutional production deployment | $4 - $10/mo | ⭐⭐⭐ Advanced |

---

## 🚀 OPTION 1: Local College Wi-Fi Deployment (Recommended for Viva)

This allows examiners and students on the **same college Wi-Fi / mobile hotspot** to access CampusNova AI on their smartphones and laptops without buying any server!

### Step 1: Find Your Laptop's Local IP Address
1. Open PowerShell / Command Prompt on your laptop.
2. Run:
   ```powershell
   ipconfig
   ```
3. Look for **IPv4 Address** (e.g., `192.168.1.100` or `192.168.43.50`).

### Step 2: Configure the Backend Server
The server is already configured to listen on all network interfaces (`0.0.0.0`) by default on port `5000`.

### Step 3: Run Frontend with Network Exposure
In `client/package.json`, update the `dev` script or start Vite with `--host`:
```powershell
cd client
npm run dev -- --host 0.0.0.0
```

### Step 4: Access on Mobile / Other Devices
- Open browser on your phone/tablet connected to the same Wi-Fi.
- Enter URL: `http://192.168.1.100:5173` *(replace with your actual IPv4)*.
- **ESP32 Microcontroller:** Update `serverUrl` in `iot-firmware/CampusNova_ESP32_Firmware.ino`:
  ```cpp
  const char* serverUrl = "http://192.168.1.100:5000/api/iot/telemetry";
  ```

---

## ☁️ OPTION 2: Free Cloud Deployment (Render + Vercel)

### Part A: Deploy Backend on Render.com (Free)
1. Push your repository to **GitHub**.
2. Go to [Render.com](https://render.com) and create a free account.
3. Click **New +** $\rightarrow$ **Web Service**.
4. Connect your GitHub repository.
5. Set the following configuration:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_super_secret_jwt_key_2026`
   - `GEMINI_API_KEY` = *(Optional: your Gemini API key)*
7. Click **Create Web Service**.
8. Copy your live backend URL (e.g., `https://campusnova-backend.onrender.com`).

---

### Part B: Deploy Frontend on Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository.
4. Set the following configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. In `client/src/services/api.js`, set the base URL to your Render backend URL when in production:
   ```javascript
   const API_BASE = import.meta.env.PROD 
     ? 'https://campusnova-backend.onrender.com/api' 
     : '/api';
   ```
6. Click **Deploy**. Vercel will give you a public URL (e.g., `https://campusnova-ai.vercel.app`).

---

## 🐳 OPTION 3: Docker & Docker Compose (One-Click Run)

Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    container_name: campusnova_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - JWT_SECRET=campusnova_secret_2026
    volumes:
      - ./server/data:/app/data

  frontend:
    build: ./client
    container_name: campusnova_frontend
    restart: always
    ports:
      - "5173:80"
    depends_on:
      - backend
```

Run with a single command:
```bash
docker compose up -d --build
```

---

## 🖥️ OPTION 4: Production Linux VPS (Ubuntu / Nginx / PM2)

For deploying to an **AWS EC2 instance**, **DigitalOcean Droplet**, or **Linode**:

### 1. Connect to VPS via SSH:
```bash
ssh root@your_vps_ip
```

### 2. Install Node.js, Git & PM2:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 3. Clone Repository & Install:
```bash
git clone https://github.com/your-username/campus-nova-ai.git
cd campus-nova-ai/server
npm install
pm2 start server.js --name "campusnova-backend"
pm2 save
pm2 startup
```

### 4. Build Frontend:
```bash
cd ../client
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### 5. Configure Nginx Reverse Proxy:
Create `/etc/nginx/sites-available/campusnova`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://localhost:5000/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site & reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/campusnova /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Enable Free SSL / HTTPS (Certbot):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---
*Your CampusNova AI platform is now live and accessible globally!*
