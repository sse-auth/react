# Firebase Adapter

> using the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) and [<kbd>Firestore</kbd>](https://firebase.google.com/docs/firestore).

## Resources

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## Setup

### Installation

```bash
$ npm install firebase-admin @sse-auth/afirebase

or

$ yarn add firebase-admin @sse-auth/afirebase

or

$ pnpm add firebase-admin @sse-auth/afirebase

or

$ bun add firebase-admin @sse-auth/afirebase
```

### Environment variables

```ini
// Auth via Service Account File
GOOGLE_APPLICATION_CREDENTIALS

// Auth via key values
AUTH_FIREBASE_PROJECT_ID
AUTH_FIREBASE_CLIENT_EMAIL
AUTH_FIREBASE_PRIVATE_KEY
```

### Configuration 

> Will be updated soon

### Authentication

#### Service Account File

First, create a Firebase project and generate a service account key. Visit: `https://console.firebase.google.com/u/0/project/{project-id}/settings/serviceaccounts/adminsdk` (replace `{project-id}` with your project’s id)

1. Download the service account key and save it in your project. (Make sure to add the file to your `.gitignore`!)
2. Add [`GOOGLE_APPLICATION_CREDENTIALS`](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) to your environment variables and point it to the service account key file.
3. The adapter will automatically pick up the environment variable and use it to authenticate with the Firebase Admin SDK. You do not need to pass any additional authentication options to the adapter.

### Service Account Values

1. Download the service account key to a temporary location (Don’t commit this file!).
2. Add the following environment variables to your project<br />
    a. `AUTH_FIREBASE_PROJECT_ID`<br />
    b. `AUTH_FIREBASE_CLIENT_EMAIL`<br />
    c. `AUTH_FIREBASE_PRIVATE_KEY`<br />

> Will be Updated soon