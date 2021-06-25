import '../styles/auth.scss'

import React, { FormEvent, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'

const NewRoom: React.FC = () => {
	const { user, loading } = useAuth()
	const history = useHistory()

	const [newRoom, setNewRoom] = useState('')

	const handleCreateRoom = async (event: FormEvent) => {
		event.preventDefault()

		if (newRoom.trim() === '') return

		const roomRef = database.ref('rooms')

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id
		})

		history.push(`/admin/rooms/${firebaseRoom.key}`)
	}

	useEffect(() => {
		if (!loading && !user) {
			history.push('/')
		}
	}, [history, loading, user])

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

					{!!user && (
						<>
							<img className="img-login" alt="avatar" src={user.avatar}></img>

							<h3 className="user-login">{user.name}</h3>
						</>
					)}

					<h2>Criar uma nova sala</h2>

					<form onSubmit={handleCreateRoom}>
						<input
							type="text"
							placeholder="Nome da sala"
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
							autoFocus
						/>

						<Button type="submit">Criar sala</Button>
					</form>

					<p>
						Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	)
}

export default NewRoom
