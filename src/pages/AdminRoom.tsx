import '../styles/room.scss'

import { Link, useHistory, useParams } from 'react-router-dom'

import answerImg from '../assets/images/answer.svg'
import checkImg from '../assets/images/check.svg'
import deleteImg from '../assets/images/delete.svg'
import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import Question from '../components/Question'
import RoomCode from '../components/RoomCode'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
	id: string
}

const AdminRoom: React.FC = () => {
	const { user } = useAuth()
	const history = useHistory()
	const params = useParams<RoomParams>()
	const roomId = params.id

	const { title, questions } = useRoom(roomId)

	const handleEndRoom = async () => {
		const roomRef = await database.ref(`rooms/${roomId}`).get()
		const { authorId } = roomRef.val()

		if (user?.id === authorId) {
			if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
				await database.ref(`rooms/${roomId}`).update({
					endedAt: new Date()
				})

				history.push('/')
			}
		}
	}

	const handleDeleteQuestion = async (questionId: string) => {
		const roomRef = await database.ref(`rooms/${roomId}`).get()
		const { authorId } = roomRef.val()

		if (user?.id === authorId) {
			if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
				await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
			}
		}
	}

	const handleCheckQuestionAsAnswered = async (questionId: string) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true
		})
	}

	const handleHighlightQuestion = async (questionId: string) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true
		})
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<Link to="/">
						<img src={logoImg} alt="Letmeask" />
					</Link>

					<div>
						<RoomCode code={roomId} />

						<Button isOutlined onClick={handleEndRoom}>
							Encerrar sala
						</Button>

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

				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!question.isAnswered && (
									<>
										<button
											type="button"
											onClick={() => handleCheckQuestionAsAnswered(question.id)}
										>
											<img src={checkImg} alt="Marcar pergunta como respondida" />
										</button>

										<button type="button" onClick={() => handleHighlightQuestion(question.id)}>
											<img src={answerImg} alt="Dar destaque à pergunta" />
										</button>
									</>
								)}

								<button type="button" onClick={() => handleDeleteQuestion(question.id)}>
									<img src={deleteImg} alt="Remover pergunta" />
								</button>
							</Question>
						)
					})}
				</div>
			</main>
		</div>
	)
}

export default AdminRoom
