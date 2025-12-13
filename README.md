# Al-Shifa Flour Mills (مطاحن الشفاء للغلال)

A production-ready React application for a flour milling company, integrated with Firebase.

## 🚀 Quick Start (Arabic)

1.  **تهيئة المشروع:** تأكد من تثبيت Node.js.
2.  **إعداد Firebase:**
    *   اذهب إلى [Firebase Console](https://console.firebase.google.com).
    *   أنشئ مشروعاً جديداً باسم `alshifa-mills`.
    *   قم بتفعيل **Authentication** (Email/Password).
    *   قم بتفعيل **Firestore Database**.
    *   قم بتفعيل **Storage**.
3.  **الربط:** انسخ إعدادات Firebase وضعها في ملف `src/firebaseConfig.ts` (انظر المثال أدناه).
4.  **التشغيل:** استخدم `npm start` أو `npm run dev`.

## 📂 Project Structure

```
/
├── index.html          # Entry point (includes Tailwind CDN & Fonts)
├── index.tsx           # Main Application Logic (SPA)
├── firestore.rules     # Security Rules for Firestore
├── public/             # Static assets
└── src/                # (Virtual Structure inside index.tsx)
    ├── components/     # Header, Hero, ProductCard
    ├── services/       # FirebaseService
    └── types/          # TypeScript Interfaces
```

## 🛠 Firebase Setup & Deployment

### 1. Configuration
To make the "Real Code" work, replace the `FirebaseService` mock in `index.tsx` with this actual implementation:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const FirebaseService = {
  async getProducts() {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  // ... other methods
};
```

### 2. Deploy to Firebase Hosting

1.  Install CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize: `firebase init`
    *   Select **Hosting**.
    *   Select **Firestore** (to deploy rules).
    *   Public directory: `dist` (or wherever your build goes).
    *   Configure as SPA: **Yes**.
4.  Build: `npm run build`
5.  Deploy: `firebase deploy`

## 📦 Product Seeding
The application currently contains a seed list in `INITIAL_PRODUCTS`. To upload these to Firestore:

1.  Uncomment the `FirebaseService.seedProducts()` logic (if added).
2.  Or manually add them via the Firebase Console using the structure defined in `index.tsx`.

## 🛡 Security
The included `firestore.rules` file ensures that:
*   **Public:** Can view products, news, events.
*   **Public:** Can create orders and job applications.
*   **Admin:** Can manage all data.

## 🎨 UI/UX
*   **Framework:** Tailwind CSS.
*   **Font:** 'Cairo' (Google Fonts) for Arabic support.
*   **Icons:** Lucide React.
*   **Colors:** Amber/Orange palette reflecting wheat/bread.
