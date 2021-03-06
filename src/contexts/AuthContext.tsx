import React, { createContext, useContext, useEffect, useState } from 'react'

import { auth, firebase } from '../services/firebase'
import { notify } from '../utils/notify'

type User = {
	id: string
	name: string
	avatar: string
}

type AuthContextData = {
	user?: User
	loading: boolean
	signInWithGoogle(): Promise<void>
	signOut(): Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthContextProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<User>()
	const [loading, setLoading] = useState(true)

	const signInWithGoogle = async (): Promise<void> => {
		const provider = new firebase.auth.GoogleAuthProvider()

		const result = await auth.signInWithPopup(provider)

		if (result.user) {
			const { uid, displayName, photoURL } = result.user

			if (!displayName || !photoURL) {
				notify('error', 'Missing information from Google Account.')
				return

				// throw new Error('Missing information from Google Account.')
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL
			})
		}
	}

	const signOut = async () => {
		await auth.signOut()
		setUser(undefined)
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				const { uid, displayName, photoURL } = user

				if (!displayName || !photoURL) {
					notify('error', 'Missing information from Google Account.')
					return

					// throw new Error('Missing information from Google Account.')
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL
				})
			}

			setLoading(false)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
