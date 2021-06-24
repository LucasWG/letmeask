import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'

type FirebaseQuestions = Record<
	string,
	{
		author: {
			name: string
			avatar: string
		}
		content: string
		isAnswered: boolean
		isHighlighted: boolean
		likes: Record<
			string,
			{
				authorId: string
			}
		>
	}
>

type QuestionType = {
	id: string
	author: {
		name: string
		avatar: string
	}
	content: string
	isAnswered: boolean
	isHighlighted: boolean
	likeCount: number
	likeId: string | undefined
}

export const useRoom = (roomId: string) => {
	const history = useHistory()

	const { user } = useAuth()
	const [title, setTitle] = useState('')
	const [questions, setQuestions] = useState<QuestionType[]>([])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`)

		roomRef.on('value', room => {
			const databaseRoom = room.val()

			if (!databaseRoom?.title) return history.push('/')

			const firebaseQuestions: FirebaseQuestions = databaseRoom?.questions ?? {}

			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
				}
			})

			setTitle(databaseRoom?.title)
			setQuestions(parsedQuestions)
			setLoading(false)
		})

		return () => {
			roomRef.off('value')
		}
	}, [history, roomId, user?.id])

	return { title, questions, loading }
}
