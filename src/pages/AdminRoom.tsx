import '../styles/room.scss'

import { Link, useHistory, useParams } from 'react-router-dom'

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
							<Question key={question.id} content={question.content} author={question.author}>
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
