import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import type { DoughInput, DoughResult } from '../lib/dough'

/** A saved snapshot: the inputs and amounts at the moment it was saved. */
export interface Recipe {
  id: string
  title: string
  notes: string
  input: DoughInput
  result: DoughResult
  createdAt: Timestamp | null
}

const recipesOf = (uid: string) => collection(db!, 'users', uid, 'recipes')

export function addRecipe(uid: string, data: Pick<Recipe, 'title' | 'notes' | 'input' | 'result'>) {
  const now = serverTimestamp()
  return addDoc(recipesOf(uid), { ...data, createdAt: now, updatedAt: now })
}

export function updateRecipe(uid: string, id: string, data: Pick<Recipe, 'title' | 'notes'>) {
  return updateDoc(doc(recipesOf(uid), id), { ...data, updatedAt: serverTimestamp() })
}

export function deleteRecipe(uid: string, id: string) {
  return deleteDoc(doc(recipesOf(uid), id))
}

export function useRecipes(uid: string | null): Recipe[] | null {
  const [loaded, setLoaded] = useState<{ uid: string; recipes: Recipe[] } | null>(null)

  useEffect(() => {
    if (!uid || !db) return
    const q = query(recipesOf(uid), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setLoaded({
        uid,
        recipes: snap.docs.map((d) => ({ id: d.id, ...(d.data({ serverTimestamps: 'estimate' }) as Omit<Recipe, 'id'>) })),
      })
    })
  }, [uid])

  return loaded && loaded.uid === uid ? loaded.recipes : null
}
