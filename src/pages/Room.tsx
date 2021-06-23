import '../styles/room.scss'

import { FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import RoomCode from '../components/RoomCode'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'
import { notify } from '../utils/notify'

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
	}
>

type Question = {
	id: string
	author: {
		name: string
		avatar: string
	}
	content: string
	isAnswered: boolean
	isHighlighted: boolean
}

type RoomParams = {
	id: string
}

const Room: React.FC = () => {
	const { user } = useAuth()
	const params = useParams<RoomParams>()
	const [newQuestion, setNewQuestion] = useState('')
	const [questions, setQuestions] = useState<Question[]>([])
	const [title, setTitle] = useState('')

	const roomId = params.id

	const handleSendQuestion = async (event: FormEvent) => {
		event.preventDefault()

		if (newQuestion.trim() === '') return

		if (!user) {
			notify('error', 'You must be logged in')

			return
		}

		// if (!user) throw new Error('You must be logged in')

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar
			},
			isHighlighted: false,
			isAnswered: false
		}

		await database.ref(`rooms/${roomId}/questions`).push(question)

		setNewQuestion('')
	}

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`)

		roomRef.on('value', room => {
			const databaseRoom = room.val()
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered
				}
			})

			setTitle(databaseRoom.title)
			setQuestions(parsedQuestions)
		})
	}, [roomId])

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<Link to="/">
						<img src={logoImg} alt="Letmeask" />
					</Link>

					<RoomCode code={roomId} />
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>

					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder="O que você quer perguntar?"
						onChange={event => setNewQuestion(event.target.value)}
						value={newQuestion}
					/>

					<div className="form-footer">
						{user ? (
							<div className="user-info">
								<img src={user.avatar} alt={user.name} />

								<span>{user.name}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta, <button>faça seu login</button>.
							</span>
						)}

						<Button type="submit" disabled={!user}>
							Enviar pergunta
						</Button>
					</div>
				</form>

				<pre style={{ whiteSpace: 'pre-wrap', margin: '30px 0', border: '1px solid #ddd', padding: 10 }}>
					{JSON.stringify(questions, null, 4)}
				</pre>
			</main>
		</div>
	)
}

export default Room
