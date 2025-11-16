# GitHub Actions Setup for Daily Signage Updates

This guide explains how to set up GitHub Actions to automatically update your signage images from OneDrive once per day.

## Setup Steps

### 1. Add OneDrive Link as GitHub Secret

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ONEDRIVE_LINK`
5. Value: Your OneDrive share link
6. Click **Add secret**

### 2. Verify Workflow File

The workflow file is already created at `.github/workflows/update-signage.yml`. It will:
- Run daily at 2 AM UTC (adjust in the workflow file if needed)
- Fetch images from your OneDrive folder
- Update `public/api/signage-images.json`
- Automatically commit and push changes back to the repository

### 3. Adjust Schedule Time (Optional)

To change when the daily update runs, edit `.github/workflows/update-signage.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Change this line
```

Cron format: `minute hour day month weekday`

**Common time examples:**
- `'0 2 * * *'` - 2 AM UTC daily
- `'0 9 * * *'` - 9 AM UTC daily (5 AM EST, 2 AM PST)
- `'0 14 * * *'` - 2 PM UTC daily (10 AM EST, 7 AM PST)
- `'0 0 * * *'` - Midnight UTC daily

**Time zone converter:**
- UTC 2 AM = 9 PM EST (previous day) = 6 PM PST (previous day)
- UTC 9 AM = 5 AM EST = 2 AM PST

### 4. Manual Trigger (Testing)

You can manually trigger the workflow anytime:

1. Go to **Actions** tab in your GitHub repository
2. Select **Update Signage Images** workflow
3. Click **Run workflow** → **Run workflow**

This is useful for testing before waiting for the scheduled time.

### 5. Verify It's Working

After the first run (either scheduled or manual):

1. Check the **Actions** tab to see if the workflow completed successfully
2. Check if `public/api/signage-images.json` was updated with the latest commit message "Auto-update signage images from OneDrive"
3. Your React app will automatically pick up the changes on the next daily refresh cycle

## How It Works

1. **Daily Schedule**: GitHub Actions runs the workflow once per day at the specified time
2. **Fetch Images**: The workflow runs the helper script to fetch images from OneDrive
3. **Update JSON**: Updates `public/api/signage-images.json` with the latest image URLs
4. **Auto-Commit**: If changes are detected, commits and pushes them back to the repository
5. **React App**: Your React app checks the JSON file daily and updates the slideshow automatically

## Troubleshooting

**Workflow not running?**
- Check that the schedule cron format is correct
- Verify the workflow file is in `.github/workflows/` directory
- Check GitHub Actions is enabled for your repository

**Getting "ONEDRIVE_LINK secret is not set" error?**
- Make sure you added the secret in Settings → Secrets and variables → Actions
- Verify the secret name is exactly `ONEDRIVE_LINK` (case-sensitive)

**Images not updating?**
- Check the workflow logs in the Actions tab
- Verify your OneDrive folder is publicly shared
- Ensure the OneDrive link in the secret is correct

**Want to change the update frequency?**
- Edit the cron schedule in `.github/workflows/update-signage.yml`
- Example: `'0 */6 * * *'` runs every 6 hours instead of daily

