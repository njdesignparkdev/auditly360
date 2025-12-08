# Blog Images Storage Setup Guide

## Quick Setup

### Option 1: Automatic Setup (Recommended)

1. **Ensure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Open the Blog Editor in your dashboard**
   - Go to Dashboard → Admin → Blog Editor
   - Click "New Blog Post" or edit an existing post
   - In the "Featured Image" section, you'll see a "Create Bucket" button if the bucket doesn't exist
   - Click "Create Bucket" to automatically create it

### Option 2: Manual Setup

#### Step 1: Create the Storage Bucket

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** → **Buckets**
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ **Yes** (checked) - This is important!
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: 
     ```
     image/jpeg, image/png, image/gif, image/webp
     ```
6. Click **"Create bucket"**

#### Step 2: Set Up Storage Policies

1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy the contents of `database/setup_blog_images_storage.sql`
3. Paste and run it in the SQL Editor
4. This sets up Row Level Security (RLS) policies to:
   - Allow public read access to images
   - Allow only admin users to upload/update/delete images

#### Step 3: Verify Setup

Run this query in SQL Editor to verify:
```sql
SELECT * FROM storage.buckets WHERE name = 'blog-images';
```

You should see the bucket listed.

## Troubleshooting

### Images not showing on blog pages?

1. **Check if the bucket exists:**
   - Go to Storage → Buckets
   - Look for `blog-images` bucket

2. **Check if bucket is public:**
   - The bucket MUST be public for images to be accessible
   - Go to Storage → Buckets → `blog-images` → Settings
   - Ensure "Public bucket" is checked

3. **Check image URLs:**
   - When you upload an image, the URL should look like:
   - `https://[your-project].supabase.co/storage/v1/object/public/blog-images/[filename]`

4. **Check browser console:**
   - Open browser DevTools → Console
   - Look for any CORS or 403 errors when loading images

### Upload fails with "Bucket not found"?

1. Make sure the bucket name is exactly `blog-images` (case-sensitive)
2. Check that you have `SUPABASE_SERVICE_ROLE_KEY` configured if using automatic setup
3. Try creating the bucket manually using Option 2 above

### Permission errors?

1. Make sure you're logged in as an admin user
2. Run the SQL script `database/setup_blog_images_storage.sql` to set up policies
3. Check that your user role is set to 'admin' in the users table

### Images upload but don't display?

1. Check the image URL in the blog's `featured_image_url` field
2. Try opening the URL directly in a browser
3. If you get a 403 error, the bucket might not be public
4. If you get a 404 error, the file might not exist at that path

## Testing

After setup, test by:

1. Creating a new blog post
2. Uploading an image
3. Saving the blog post
4. Viewing the blog on `/blogs` page
5. The image should display correctly

## Need Help?

- Check the browser console for errors
- Check the server logs for API errors
- Verify all environment variables are set correctly
- Ensure Supabase service is accessible

