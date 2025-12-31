# Posts Loading Issue - Fixed

## Problem
- Posts were not showing (401 Unauthorized)
- Cannot create new posts
- Page keeps loading indefinitely

## Root Cause

The issue was caused by **invalid authentication tokens**. If you logged in **before** `JWT_SECRET` was added to the Docker configuration, your token was created without a secret key and is now invalid.

## Solution Applied

1. **Fixed WebSocket URL** - Updated `getSocketBaseUrl()` to handle relative URLs correctly
2. **Fixed Upload File Function** - Updated to include authentication token in upload requests
3. **Rebuilt Frontend** - All fixes are now included in the new build

## What You Need to Do

**IMPORTANT: You need to log out and log back in to get a new valid token!**

1. **Log out** from your current session
2. **Clear browser cache/localStorage** (optional but recommended):
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage
   - Or manually delete `cc_token` and `cc_user` entries
3. **Log back in** with your credentials
4. **Try accessing posts again**

## Why This Happens

When you logged in before `JWT_SECRET` was configured:
- The token was created with `undefined` as the secret
- Now the backend validates tokens using the actual `JWT_SECRET`
- Old tokens fail validation → 401 Unauthorized

## Verification

After logging in again, you should see:
- ✅ Posts loading correctly
- ✅ Can create new posts
- ✅ No infinite loading
- ✅ WebSocket connections working

## Technical Details

### Changes Made:
1. **frontend/src/utils/api.js**:
   - Fixed `getSocketBaseUrl()` to use `window.location.origin` for relative URLs
   - Updated `uploadFile()` to include auth token in headers

2. **Backend**:
   - `JWT_SECRET` is now properly configured
   - Token validation works correctly

### API Flow:
1. User logs in → Gets token signed with `JWT_SECRET`
2. Token stored in `localStorage` as `cc_token`
3. API interceptor adds token to all requests: `Authorization: Bearer <token>`
4. Backend validates token using `JWT_SECRET`
5. If valid → Request proceeds, if invalid → 401 Unauthorized

## If Issues Persist

If you still have issues after logging in again:

1. Check browser console for errors
2. Verify token is in localStorage: `localStorage.getItem('cc_token')`
3. Check backend logs: `docker-compose logs backend`
4. Try creating a new account to test

