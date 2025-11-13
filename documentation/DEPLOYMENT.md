# Deployment Guide

## Prerequisites

- Node.js 18+
- A running backend API
- Git repository

---

## 🚀 Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
```
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_NAME=Notified
VITE_APP_VERSION=1.0.0
```

### Step 4: Deploy
Click "Deploy" and you're live! 🎉

**Custom Domain**: Add in Project Settings → Domains

---

## 🌐 Netlify

### Option 1: Drag & Drop
```bash
npm run build
# Upload the dist/ folder to Netlify
```

### Option 2: CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Git Integration
1. Connect your GitHub repo
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variables in Site Settings → Build & Deploy

---

## 🐳 Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Build & Run
```bash
docker build -t notified-frontend .
docker run -p 80:80 notified-frontend
```

### Docker Compose (with backend)
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:3000/api
    depends_on:
      - backend
  
  backend:
    image: your-backend-image
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/notified
  
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## ☁️ AWS S3 + CloudFront

### Step 1: Build
```bash
npm run build
```

### Step 2: Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

### Step 3: Create CloudFront Distribution
- Origin: Your S3 bucket
- Default Root Object: `index.html`
- Error Pages: Redirect 404 to `/index.html` (for SPA routing)

### Step 4: Environment Variables
Use build-time variables during `npm run build`:
```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

---

## 🔧 Environment Variables

### Development (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Notified Dev
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.notified.com/api
VITE_APP_NAME=Notified
```

**Note**: Vite only includes variables prefixed with `VITE_`

---

## 📊 Performance Optimization

### Enable Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### Set Cache Headers
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable HTTP/2
```nginx
listen 443 ssl http2;
```

---

## 🔒 Security Headers

Add to your server config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

---

## 🚨 Troubleshooting

### Issue: 404 on Page Refresh
**Solution**: Configure server to serve `index.html` for all routes

**Nginx**:
```nginx
try_files $uri $uri/ /index.html;
```

**Apache (.htaccess)**:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Issue: CORS Errors
**Solution**: Configure backend CORS or use proxy

**Backend (Express)**:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}))
```

### Issue: Environment Variables Not Working
- Ensure they start with `VITE_`
- Restart dev server after changing .env
- Rebuild for production

---

## 📈 Monitoring

### Vercel Analytics
Already integrated! View in Vercel dashboard.

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## ✅ Deployment Checklist

- [ ] Build passes without errors
- [ ] Environment variables configured
- [ ] Backend API is accessible
- [ ] CORS configured correctly
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Error pages set up (404, 500)
- [ ] Monitoring enabled
- [ ] Security headers added
- [ ] Performance optimization done

---

## 🎯 Next Steps

1. Deploy backend API first
2. Update VITE_API_BASE_URL
3. Build and deploy frontend
4. Test all features
5. Monitor for errors
6. Set up CI/CD pipeline

**Need help?** Open an issue on GitHub!

---

**Happy Deploying!** 🚀
