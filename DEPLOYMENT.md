# Deployment Guide for cPanel/WHM Node.js Hosting

This guide will help you deploy RelocationLogic.com on a self-hosted cPanel/WHM environment with Node.js support.

## Prerequisites

- cPanel account with Node.js support enabled
- SSH access to your server
- Node.js 18+ installed on the server
- Domain configured in cPanel

## Step 1: Build the Application

On your local machine:

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

This creates:
- `.next/standalone/` - Self-contained application
- `.next/static/` - Static assets
- `public/` - Public files

## Step 2: Prepare Files for Upload

Create a deployment package:

```bash
# Create deployment directory
mkdir deploy
cp -r .next/standalone/* deploy/
cp -r .next/static deploy/.next/
cp -r public deploy/
```

## Step 3: Upload to Server

### Option A: Using cPanel File Manager

1. Log into cPanel
2. Navigate to File Manager
3. Go to your domain's directory (e.g., `public_html` or `apps/relocationlogic`)
4. Upload the `deploy` folder contents
5. Extract if uploaded as ZIP

### Option B: Using FTP/SFTP

Use your preferred FTP client (FileZilla, WinSCP, etc.):

```
Host: your-server.com
Username: your-cpanel-username
Password: your-cpanel-password
Port: 21 (FTP) or 22 (SFTP)
```

Upload the contents of the `deploy` folder.

### Option C: Using SSH/SCP

```bash
# From your local machine
scp -r deploy/* username@your-server.com:/home/username/apps/relocationlogic/
```

## Step 4: Set Up Node.js Application in cPanel

1. Log into cPanel
2. Navigate to "Setup Node.js App" or "Application Manager"
3. Click "Create Application"

### Configuration:

- **Node.js version**: Select 18.x or higher
- **Application mode**: Production
- **Application root**: `/home/username/apps/relocationlogic`
- **Application URL**: `relocationlogic.com` or your domain
- **Application startup file**: `server.js`
- **Environment variables**: (Optional)
  - `NODE_ENV=production`
  - `PORT=3000` (or cPanel assigned port)

4. Click "Create" or "Save"

## Step 5: Configure Environment Variables (Optional)

In the Node.js App settings, add:

```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://relocationlogic.com
```

## Step 6: Start the Application

1. In cPanel Node.js App Manager, click "Start Application"
2. Wait for the application to start
3. Check the status - should show "Running"

## Step 7: Configure Domain

### If using subdomain:

1. In cPanel, go to "Domains" or "Subdomains"
2. Create subdomain: `relocationlogic.yourdomain.com`
3. Point document root to the application URL

### If using primary domain:

1. Update `.htaccess` in your document root:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
```

Replace `PORT` with the port assigned by cPanel.

## Step 8: Verify Installation

Visit your domain in a browser:
- Homepage: `https://your-domain.com/`
- Sample page: `https://your-domain.com/salary/austin-tx/software-engineer`
- Sitemap: `https://your-domain.com/sitemap.xml`
- Robots: `https://your-domain.com/robots.txt`

## Troubleshooting

### Application won't start

Check logs in cPanel Node.js App Manager:
```bash
# Via SSH
tail -f ~/nodevenv/relocationlogic/logs/app.log
```

Common issues:
- Missing dependencies: Run `npm install` on server
- Wrong Node.js version: Update in cPanel settings
- Port already in use: Change port in cPanel

### 404 Errors

Ensure all files are uploaded:
- `server.js` exists
- `.next/` directory with `static/` subfolder
- `public/` directory

### Slow Performance

1. Enable compression in cPanel
2. Enable CDN (Cloudflare)
3. Optimize images
4. Enable caching headers

## Step 9: Set Up SSL Certificate

1. In cPanel, go to "SSL/TLS"
2. Use Let's Encrypt (free) or upload your certificate
3. Enable "Force HTTPS Redirect"

## Step 10: Set Up Automatic Restart

Create a cron job to restart the app if it crashes:

1. In cPanel, go to "Cron Jobs"
2. Add new cron job:
   ```
   */5 * * * * /usr/bin/curl https://your-domain.com/api/health || /usr/local/cpanel/scripts/restartsrv nodejs
   ```

## Updating the Application

To deploy updates:

1. Build new version locally: `npm run build`
2. Upload new files (overwrite existing)
3. In cPanel Node.js App Manager, click "Restart"

### Alternative: Using Git

Set up Git deployment:

```bash
# On server via SSH
cd ~/apps/relocationlogic
git init
git remote add origin https://github.com/jameson5555/relocationlogic.git
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart from cPanel
```

Create update script `update.sh`:

```bash
#!/bin/bash
cd ~/apps/relocationlogic
git pull origin main
npm install
npm run build
# Restart app via cPanel API or manually
```

## Performance Optimization

### Enable Gzip Compression

Add to `.htaccess`:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Enable Browser Caching

Add to `.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Monitoring

### Check Application Status

```bash
# Via SSH
pm2 list  # If using PM2
# or
ps aux | grep node
```

### View Logs

```bash
# Application logs
tail -f ~/apps/relocationlogic/logs/app.log

# Node.js logs
tail -f ~/nodevenv/relocationlogic/logs/stderr.log
```

## Backup Strategy

Regular backups:

1. **Database**: Not applicable (static data in JSON)
2. **Files**: 
   - `data/cities.json`
   - `data/careers.json`
   - Any custom configuration

Set up cPanel backup schedule or manual backups.

## Support

For cPanel-specific issues, contact your hosting provider.
For application issues, check the main README.md or open a GitHub issue.

## Alternative: Using PM2

If cPanel Node.js manager is not available, use PM2:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name relocationlogic

# Save PM2 configuration
pm2 save

# Set up startup script
pm2 startup

# View logs
pm2 logs relocationlogic
```

---

Congratulations! Your RelocationLogic application should now be running on your cPanel/WHM server.
