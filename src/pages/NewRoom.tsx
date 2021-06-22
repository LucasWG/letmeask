import '../styles/auth.scss'

import React from 'react'
import { Link } from 'react-router-dom'

import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
// import { useAuth } from '../contexts/AuthContext'

const NewRoom: React.FC = () => {
	// const { user } = useAuth()

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

					<h2>Criar uma nova sala</h2>

					<form>
						<input type="text" placeholder="Nome da sala" />

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
