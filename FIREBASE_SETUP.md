# Firebase Setup Guide for NutriVision AI

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `nutrivision-ai` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app with nickname: `NutriVision Web App`
3. **Don't** check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the `firebaseConfig` object values

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your preferred location (e.g., `us-central`)
5. Click "Enable"

### Security Rules (Update Later for Production)

For development, use test mode rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 3, 1);
    }
  }
}
```

For production, update to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal logs - users can only access their own
    match /mealLogs/{logId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 5: Configure Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values with your Firebase config:

```env
GEMINI_API_KEY=your_existing_gemini_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_from_firebase_config
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Where to Find These Values:

1. Go to Firebase Console → Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Find your web app and click the config icon
4. Copy each value to your `.env.local` file

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Click "Register" on the landing page
4. Create a test account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Role: Athlete

5. Check Firebase Console:
   - **Authentication** → **Users** tab should show your new user
   - **Firestore Database** → **Data** tab should show a `users` collection with your user document

## Firestore Database Structure

The app uses the following collections:

### `users` Collection
```
users/{userId}
  - uid: string
  - email: string
  - name: string
  - role: 'user' | 'trainer'
  - createdAt: timestamp
  - lastLogin: timestamp
```

### Future Collections (to be implemented):
- `mealLogs/{logId}` - User meal history
- `workouts/{workoutId}` - Fitness tracking data
- `progress/{progressId}` - Weight and progress tracking

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Make sure all Firebase config values in `.env.local` are correct
- Restart your dev server after updating `.env.local`

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check that `VITE_FIREBASE_API_KEY` is correct
- Make sure there are no extra spaces in the `.env.local` file

### Error: "Missing or insufficient permissions"
- Go to Firestore Database → Rules
- Make sure you're in test mode or have proper security rules set up

### Users Not Appearing in Firebase Console
- Check browser console for errors
- Verify Authentication is enabled in Firebase Console
- Make sure Email/Password provider is enabled

## Next Steps

After successful setup:
1. ✅ User registration and login working
2. 🔄 Connect meal logs to Firestore
3. 🔄 Store fitness data in Firestore
4. 🔄 Sync progress tracking with Firebase
5. 🔄 Add user profile management
6. 🔄 Implement data persistence across devices

## Security Best Practices

Before deploying to production:
- [ ] Update Firestore security rules
- [ ] Enable email verification
- [ ] Add password reset functionality
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for registration
- [ ] Set up Firebase App Check
- [ ] Review and restrict API key usage in Google Cloud Console
