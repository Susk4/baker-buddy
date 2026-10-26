import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { DEFAULT_PERCENTAGES, type Percentages } from '../lib/defaults'

export function saveUserDefaults(uid: string, defaults: Percentages): Promise<void> {
  if (!db) return Promise.resolve()
  return setDoc(doc(db, 'users', uid), { defaults, updatedAt: serverTimestamp() })
}

/** The signed-in user's default percentages, or the built-in ones. */
export function useUserDefaults(uid: string | null): Percentages {
  const [loaded, setLoaded] = useState<{ uid: string; defaults: Percentages } | null>(null)

  useEffect(() => {
    if (!uid || !db) return
    return onSnapshot(doc(db, 'users', uid), (snap) => {
      setLoaded({ uid, defaults: { ...DEFAULT_PERCENTAGES, ...(snap.data()?.defaults ?? {}) } })
    })
  }, [uid])

  return loaded && loaded.uid === uid ? loaded.defaults : DEFAULT_PERCENTAGES
}
