# Subdomain Setup Guide for Centuries Mutual

This guide explains how to set up subdomains `newspaper.centuriesmutual.com` and `block.centuriesmutual.com` using GitHub and Vercel.

## Overview

- **newspaper.centuriesmutual.com** - Redirects users when they click newspaper links
- **block.centuriesmutual.com** - Redirects users after login

## Option 1: Using Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps with custom domains and subdomains.

### Step 1: Deploy Your Main Site to Vercel

1. **Connect GitHub Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure Main Domain:**
   - In your Vercel project settings, go to "Domains"
   - Add `centuriesmutual.com` as your main domain
   - Follow DNS instructions to point your domain to Vercel

### Step 2: Set Up Subdomains

#### For newspaper.centuriesmutual.com:

**Option A: Deploy Newspaper as Separate Project (Recommended)**
1. Create a new Vercel project for the newspaper
2. In project settings → Domains, add `newspaper.centuriesmutual.com`
3. Configure DNS:
   - Add a CNAME record: `newspaper` → `cname.vercel-dns.com`
   - Or use Vercel's automatic DNS configuration

**Option B: Use Vercel Redirects (Simpler)**
1. In your main Vercel project, go to Settings → Redirects
2. Add redirect rule:
   ```
   Source: /newspaper
   Destination: https://newspaper.centuriesmutual.com
   Permanent: true (308)
   ```

#### For block.centuriesmutual.com:

1. Create a new Vercel project for the block/dashboard
2. In project settings → Domains, add `block.centuriesmutual.com`
3. Configure DNS:
   - Add a CNAME record: `block` → `cname.vercel-dns.com`

### Step 3: Configure DNS Records

In your domain registrar (where you bought centuriesmutual.com):

1. **For newspaper.centuriesmutual.com:**
   ```
   Type: CNAME
   Name: newspaper
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

2. **For block.centuriesmutual.com:**
   ```
   Type: CNAME
   Name: block
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **For main domain (if not already set):**
   ```
   Type: A
   Name: @
   Value: [Vercel's IP address - check Vercel dashboard]
   ```

   OR use CNAME:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### Step 4: SSL Certificates

Vercel automatically provisions SSL certificates for all domains and subdomains. This usually takes a few minutes after DNS propagation.

## Option 2: Using GitHub Pages + Custom Server

If you prefer not to use Vercel:

### Step 1: Set Up DNS Records

In your domain registrar, add:

```
Type: CNAME
Name: newspaper
Value: your-server-ip-or-domain
TTL: 3600

Type: CNAME
Name: block
Value: your-server-ip-or-domain
TTL: 3600
```

### Step 2: Configure Web Server (Nginx Example)

```nginx
# /etc/nginx/sites-available/newspaper.centuriesmutual.com
server {
    listen 80;
    server_name newspaper.centuriesmutual.com;
    
    location / {
        proxy_pass http://localhost:3000;  # Your Next.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# /etc/nginx/sites-available/block.centuriesmutual.com
server {
    listen 80;
    server_name block.centuriesmutual.com;
    
    location / {
        proxy_pass http://localhost:3001;  # Your dashboard app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Option 3: Using Cloudflare

If you use Cloudflare for DNS:

1. **Add DNS Records in Cloudflare:**
   - Go to DNS settings
   - Add CNAME record: `newspaper` → `your-vercel-deployment.vercel.app`
   - Add CNAME record: `block` → `your-block-deployment.vercel.app`
   - Enable "Proxy" (orange cloud) for SSL

2. **Configure SSL/TLS:**
   - Set SSL/TLS encryption mode to "Full" or "Full (strict)"
   - Cloudflare will automatically handle SSL certificates

## Verification Steps

1. **Test DNS Propagation:**
   ```bash
   # Check if DNS is resolving
   nslookup newspaper.centuriesmutual.com
   nslookup block.centuriesmutual.com
   ```

2. **Test Redirects:**
   - Visit your main site and click "Newspaper" link
   - Should redirect to `https://newspaper.centuriesmutual.com`
   - After login, should redirect to `https://block.centuriesmutual.com`

3. **Check SSL:**
   - Visit `https://newspaper.centuriesmutual.com` (should show secure lock)
   - Visit `https://block.centuriesmutual.com` (should show secure lock)

## Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) or `ipconfig /flushdns` (Windows)
- Check DNS records are correct in your registrar

### SSL Certificate Issues
- Vercel: Wait 5-10 minutes after adding domain
- Cloudflare: Ensure SSL/TLS mode is set correctly
- Check certificate status in Vercel/Cloudflare dashboard

### Redirects Not Working
- Verify code changes are deployed
- Check browser console for errors
- Test in incognito mode to avoid cache issues

## Recommended Setup

**For easiest setup, use Vercel:**
1. Deploy main site to Vercel
2. Deploy newspaper as separate Vercel project
3. Deploy block/dashboard as separate Vercel project
4. Add subdomains in each project's domain settings
5. Configure DNS records at your registrar

This gives you:
- ✅ Automatic SSL certificates
- ✅ Easy deployment from GitHub
- ✅ Automatic deployments on git push
- ✅ Built-in CDN and performance optimization
- ✅ Free tier available

## Next Steps

1. Choose your deployment platform (Vercel recommended)
2. Set up DNS records at your domain registrar
3. Deploy your applications
4. Test the redirects
5. Monitor for any issues

## Support

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- Check your domain registrar's DNS documentation
- Verify DNS records using tools like `dig` or online DNS checkers

