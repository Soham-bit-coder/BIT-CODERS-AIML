# Fix: Missing or Insufficient Permissions Error

## Quick Fix (Recommended for Development)

### Option 1: Use Test Mode (Easiest - 30 days)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 4, 1);
    }
  }
}
```

6. Click **Publish**
7. Try registering again

**Note**: This allows all reads/writes until April 1, 2025. Perfect for development!

---

### Option 2: Production-Ready Rules (Recommended for Production)

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal logs - users can only access their own
    match /mealLogs/{logId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Progress tracking - users can only access their own
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Fitness data - users can only access their own
    match /fitness/{fitnessId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **Publish**
4. Try registering again

---

## Why This Error Happens

The error "Missing or insufficient permissions" occurs because:
- Firestore has security rules that block unauthorized access
- By default, Firestore denies all reads/writes
- You need to explicitly allow operations in the rules

## Verify the Fix

After updating the rules:

1. Clear browser cache and localStorage:
   ```javascript
   // Open browser console (F12) and run:
   localStorage.clear();
   location.reload();
   ```

2. Try registering a new user:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Role: Athlete

3. Check Firebase Console:
   - Go to **Authentication** → **Users** (should see your user)
   - Go to **Firestore Database** → **Data** (should see `users` collection)

## Still Having Issues?

### Check Authentication is Enabled
1. Firebase Console → Authentication
2. Click **Sign-in method** tab
3. Make sure **Email/Password** is **Enabled**

### Check Firestore is Created
1. Firebase Console → Firestore Database
2. If you see "Create database", click it
3. Choose **Start in test mode**
4. Select location and click **Enable**

### Check Environment Variables
Make sure `.env.local` has correct Firebase config:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Restart Dev Server
After any `.env.local` changes:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Testing the Fix

Once rules are updated, test these operations:

1. **Register**: Should create user in Auth + Firestore
2. **Login**: Should authenticate and retrieve user data
3. **Logout**: Should clear session
4. **Re-login**: Should work with same credentials

## Common Mistakes

❌ **Wrong**: Forgetting to click "Publish" after updating rules
✅ **Right**: Always click "Publish" button in Firebase Console

❌ **Wrong**: Using old/expired test mode rules
✅ **Right**: Update timestamp or use production rules

❌ **Wrong**: Not restarting dev server after `.env.local` changes
✅ **Right**: Always restart after environment variable changes

## Need More Help?

Check the browser console (F12) for detailed error messages:
- `auth/invalid-api-key` → Check Firebase API key
- `permission-denied` → Update Firestore rules
- `auth/network-request-failed` → Check internet connection
- `auth/email-already-in-use` → User already exists, try logging in
