import '../styles/room.scss'

import { FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import Question from '../components/Question'
import RoomCode from '../components/RoomCode'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { notify } from '../utils/notify'

type RoomParams = {
	id: string
}

const Room: React.FC = () => {
	const { user } = useAuth()
	const params = useParams<RoomParams>()
	const [newQuestion, setNewQuestion] = useState('')

	const roomId = params.id

	const { title, questions, loading } = useRoom(roomId)

	const handleSendQuestion = async (event: FormEvent) => {
		event.preventDefault()

		if (newQuestion.trim() === '') return

		if (!user) {
			notify('error', 'You must be logged in')

			return
		}

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

	const handleLikeQuestion = async (questionId: string, likeId: string | undefined) => {
		if (likeId) {
			await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
		} else {
			await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
				authorId: user?.id
			})
		}
	}

	if (loading) return <div />

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<Link to="/">
						<img src={logoImg} alt="Letmeask" />
					</Link>

					<div>
						<RoomCode code={roomId} />

						<a href="https://github.com/LucasWG94/letmeask" target="_blank" rel="noopener noreferrer">
							<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>
					</div>
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>{title}</h1>

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

				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								content={question.content}
								author={question.author}
								key={question.id}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!!user && !question.isAnswered && (
									<button
										className={`like-button ${question.likeId ? 'liked' : ''}`}
										type="button"
										aria-label="Marcar como gostei"
										onClick={() => handleLikeQuestion(question.id, question.likeId)}
									>
										{question.likeCount > 0 && <span>{question.likeCount}</span>}

										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
												stroke="#737380"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								)}
							</Question>
						)
					})}
				</div>

				{/* <pre style={{ whiteSpace: 'pre-wrap', margin: '30px 0', border: '1px solid #ddd', padding: 10 }}>
					{JSON.stringify(questions, null, 4)}
				</pre> */}
			</main>
		</div>
	)
}

export default Room
