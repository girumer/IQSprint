# Deploying IQsprint to the VPS

## 1. Backend

```bash
cd backend
npm install --omit=dev
npm install -g pm2          # once
pm2 start ecosystem.config.js
pm2 save && pm2 startup     # restart automatically after a reboot
```

`backend/.env` needs `DATABASE_URL`, `JWT_SECRET` and (optionally) `PORT` (default 8080).
For speed, the MongoDB database should be on the same VPS or in the same region as it.

After code changes: `pm2 restart iqsprint-api`

## 2. Frontend

In `frontend/.env` set the backend URL to empty, so requests go through nginx:

```
REACT_APP_BACKENDURL=
```

Then build:

```bash
cd frontend
npm install
npm run build
```

Copy `frontend/build/` to the folder named in the nginx config (for example `/var/www/iqsprint/frontend/build`).

Do not run `npm start` on the VPS. That is the slow development server.

## 3. nginx

```bash
sudo cp deploy/nginx-iqsprint.conf /etc/nginx/sites-available/iqsprint
sudo ln -s /etc/nginx/sites-available/iqsprint /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Edit `server_name` and `root` in the file first.

## 4. HTTPS (recommended, players send passwords)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```
