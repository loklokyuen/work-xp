# Work-XP

Work-XP is a mobile platform that connects students seeking work experience with businesses offering short-term opportunities. Whether you're a student looking to gain valuable work experience or a business wanting to offer work experience roles, this platform simplifies the entire process of posting and applying.

A live web preview can be found [here](https://work-xp.netlify.app/). *(Features mirror the mobile app; web preview optimized for mobile view only as this is primarily a mobile application)*

## Tech Stack
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Image Storage**: Cloudinary
- **UI Components**: React Native Paper

## Features

- **Post Work Opportunities**: Employers can create and manage job postings for work experience positions.
- **Apply for Work Experience**: Students can browse available opportunities and apply directly through the platform.
- **User Profiles**: Create and manage personal profiles with details about your skills, experience, and work preferences.
- **Secure Login**: Firebase-powered authentication for all users.
- **Real-Time Chat**: In-app messaging between students and employers, powered by Firestore.

## Getting Started

Follow these steps to set up and run the project locally:
### Prerequisites
- Node.js
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing)

### 1. Clone the Repository

Clone this repository to your local machine:

```git clone https://github.com/loklokyuen/work-xp.git && cd work-xp```

### 2. Install dependencies

```npm install```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following:

**Required Firebase keys** (for core functionality):
```
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_AUTH_DOMAIN=
EXPO_PUBLIC_PROJECT_ID=
EXPO_PUBLIC_STORAGE_BUCKET=
EXPO_PUBLIC_MESSAGING_SENDER_ID=
EXPO_PUBLIC_APP_ID=
EXPO_PUBLIC_MEASUREMENT_ID=
EXPO_PUBLIC_DATABASE_URL=
```
**Optional Cloudinary keys** (for custom avatar uploads):
```
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_API_KEY=
EXPO_PUBLIC_CLOUDINARY_API_SECRET=
```
Note: Obtain these keys from your Firebase Console and Cloudinary Dashboard.
### 4. Run the project

```npx expo start```

- Press `w` for web preview
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan the QR code with Expo Go (Android) or Camera (iOS) on your phone

--- 

Developed by a group of 6 as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
