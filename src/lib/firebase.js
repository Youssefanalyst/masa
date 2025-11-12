import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let app
let analytics

export const isFirebaseEnabled = () => !!firebaseConfig.apiKey

export const initFirebase = () => {
  if (!isFirebaseEnabled()) return null
  if (!app) app = initializeApp(firebaseConfig)
  return app
}

export const getDb = () => {
  const a = initFirebase()
  return a ? getFirestore(a) : null
}

export const getStorageInstance = () => {
  const a = initFirebase()
  return a ? getStorage(a) : null
}

export const initAnalytics = async () => {
  const a = initFirebase()
  if (!a) return null
  if (typeof window === 'undefined') return null
  const supported = await analyticsIsSupported()
  if (!supported) return null
  if (!analytics) analytics = getAnalytics(a)
  return analytics
}
