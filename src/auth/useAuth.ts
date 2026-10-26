import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

const POPUP_UNAVAILABLE = ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment']

export async function signIn(): Promise<void> {
  if (!auth) return
  try {
    await signInWithPopup(auth, provider)
  } catch (err) {
    if (err instanceof FirebaseError && POPUP_UNAVAILABLE.includes(err.code)) {
      await signInWithRedirect(auth, provider)
      return
    }
    if (err instanceof FirebaseError && err.code === 'auth/popup-closed-by-user') return
    throw err
  }
}

export async function signOut(): Promise<void> {
  if (auth) await fbSignOut(auth)
}

export function useAuth(): { user: User | null; ready: boolean } {
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null)
  const [ready, setReady] = useState(!auth)

  useEffect(() => {
    if (!auth) return
    getRedirectResult(auth).catch(() => {})
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setReady(true)
    })
  }, [])

  return { user, ready }
}
