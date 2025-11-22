# Fixing Google Drive 403 Errors - Complete Guide

If you're getting 403 errors when loading images from Google Drive, follow these steps **exactly**:

## The Problem

Google Drive requires **very specific sharing permissions** for direct image access. Even if you think files are "publicly shared," they might not be configured correctly for direct URL access.

## Step-by-Step Fix

### 1. Share Each Individual Image File

**This is critical** - You must share each file individually, not just the folder.

1. **Open Google Drive** in your browser
2. **Open the folder** containing your images
3. **For EACH image file:**
   - Right-click the image file
   - Click **"Share"** button
   - Click **"Change to anyone with the link"**
   - Set permission to **"Viewer"**
   - Click **"Done"**

**Quick method for multiple files:**
1. Select all image files in the folder (Ctrl+A / Cmd+A)
2. Right-click → **"Share"**
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

### 2. Verify File Sharing

Run the verification script to check if files are properly shared:

```bash
npm run verify-gdrive-sharing <YOUR_FOLDER_ID> <YOUR_API_KEY>
```

This will tell you:
- Which files are shared
- Which files are NOT shared
- Exactly what needs to be fixed

### 3. Share the Folder Too

1. Right-click the **folder** (not individual files)
2. Click **"Share"**
3. Set to **"Anyone with the link"** → **"Viewer"**
4. Click **"Done"**

### 4. Test a URL Directly

After sharing, test a URL directly in your browser:

```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

**If this works in the browser**, it should work in the app.

**If this still gives 403**, the file isn't properly shared - go back to step 1.

### 5. Regenerate Images JSON

After fixing sharing, regenerate the JSON file:

```bash
npm run generate-signage-images-gdrive <YOUR_FOLDER_ID> public/api/signage-images.json <YOUR_API_KEY>
```

### 6. Common Issues

#### Issue: "Files are shared but still getting 403"

**Solution:**
- Make sure you're sharing with **"Anyone with the link"** (not "People in your organization")
- Each file needs individual sharing permission
- Try clearing browser cache and testing URL directly

#### Issue: "Works in browser but not in app"

**Solution:**
- This is usually a CORS or referrer policy issue
- The app now uses multiple URL format fallbacks
- Regenerate JSON file - script will use the best available format

#### Issue: "URLs work for a few hours then start failing"

**Solution:**
- This happens with Google Drive CDN URLs (lh3.googleusercontent.com)
- The script now uses permanent file ID URLs instead
- Regenerate JSON file to get permanent URLs

### 7. Alternative: Use Google Drive Sharing Links

If direct URLs still don't work, you can manually create sharing links:

1. Right-click each image → **"Get link"**
2. Copy the link: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
3. Extract file ID from URL
4. Convert to direct URL: `https://drive.google.com/uc?export=view&id=FILE_ID`
5. Add to JSON file manually

### 8. Ultimate Solution: Deploy More Frequently

Since the deploy workflow now automatically fetches fresh URLs from Google Drive:

1. **Every deployment** gets the latest URLs
2. **Daily schedule** regenerates URLs automatically
3. **Manual trigger** can force immediate refresh

If URLs expire, just trigger a new deployment and fresh URLs will be fetched.

## Testing Checklist

- [ ] Each image file is shared individually with "Anyone with the link"
- [ ] Folder is shared with "Anyone with the link"
- [ ] Tested URL directly in browser - works without login
- [ ] Regenerated JSON file after fixing sharing
- [ ] Verified sharing with `verify-gdrive-sharing` script
- [ ] Deployed updated code to get fresh URLs

## Still Having Issues?

If you've done all the above and still get 403 errors:

1. **Check Google Workspace restrictions** - Your organization might have policies blocking public sharing
2. **Verify API key permissions** - Ensure Drive API is enabled and key has proper access
3. **Try a different Google account** - Use a personal Google account instead of Workspace account
4. **Check file permissions** - Some files might have inherited restrictions

## Quick Command Reference

```bash
# Verify sharing
npm run verify-gdrive-sharing <FOLDER_ID> <API_KEY>

# Regenerate images JSON
npm run generate-signage-images-gdrive <FOLDER_ID> public/api/signage-images.json <API_KEY>

# Test URL directly (replace FILE_ID)
curl -I "https://drive.google.com/uc?export=view&id=FILE_ID"
```

