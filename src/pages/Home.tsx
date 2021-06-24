import '../styles/auth.scss'

import React, { FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import googleIconImg from '../assets/images/google-icon.svg'
import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'
import { notify } from '../utils/notify'

const Home: React.FC = () => {
	const history = useHistory()

	const [roomCode, setRoomCode] = useState('')
	const [rooms, setRooms] = useState<string[]>([])

	const { user, signInWithGoogle } = useAuth()

	const handleCreateRoom = async () => {
		if (!user) {
			await signInWithGoogle()
		}

		history.push('/rooms/new')
	}

	const handleJoinRoom = async (event: FormEvent) => {
		event.preventDefault()

		if (roomCode.trim() === '') return

		const roomRef = await database.ref(`rooms/${roomCode}`).get()

		if (!roomRef.exists()) {
			notify('error', 'Room does not exists.')
			return
		}

		if (roomRef.val().endedAt) {
			notify('error', 'Room already closed.')
			return
		}

		history.push(`/rooms/${roomCode}`)
	}

	const handleJoinRandomRoom = async () => {
		let random = rooms[Math.floor(Math.random() * rooms.length)]

		if (random === roomCode && rooms.length > 1) {
			handleJoinRandomRoom()
			return
		}

		setRoomCode(random)
	}

	useEffect(() => {
		const roomsRef = database.ref(`rooms`)

		roomsRef.on('value', room => {
			const databaseRoom = room.val()
			const roomsResult = Object.keys(databaseRoom)

			setRooms(roomsResult)
		})

		return () => {
			roomsRef.off('value')
		}
	}, [history])

	return (
		<div id="page-auth">
			<aside>
				<img src={illustration} alt="Ilustração simbolizando perguntas e respostas" />

				<strong>Crie salas de Q&amp;A ao-vivo</strong>

				<p>Tire as dúvidas da sua audiência em tempo-real</p>
			</aside>

			<main>
				<div className="main-content">
					<img src={logoImg} alt="Let Me Ask" />

					<button type="button" className="create-room" onClick={handleCreateRoom}>
						<img src={googleIconImg} alt="Logo do Google" />

						{!!user ? 'Crie sua sala' : 'Crie sua sala com o Google'}
					</button>

					<div className="separator">ou entre em uma sala</div>

					<form onSubmit={handleJoinRoom}>
						<div>
							<input
								type="text"
								placeholder="Digite o código da sala"
								onChange={event => setRoomCode(event.target.value)}
								value={roomCode}
							/>

							{rooms.length > 0 && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									onClick={handleJoinRandomRoom}
								>
									<path d="M18 9v-3c-1 0-3.308-.188-4.506 2.216l-4.218 8.461c-1.015 2.036-3.094 3.323-5.37 3.323h-3.906v-2h3.906c1.517 0 2.903-.858 3.58-2.216l4.218-8.461c1.356-2.721 3.674-3.323 6.296-3.323v-3l6 4-6 4zm-9.463 1.324l1.117-2.242c-1.235-2.479-2.899-4.082-5.748-4.082h-3.906v2h3.906c2.872 0 3.644 2.343 4.631 4.324zm15.463 8.676l-6-4v3c-3.78 0-4.019-1.238-5.556-4.322l-1.118 2.241c1.021 2.049 2.1 4.081 6.674 4.081v3l6-4z" />
								</svg>
							)}
						</div>

						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	)
}

export default Home
