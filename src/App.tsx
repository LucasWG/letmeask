import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContext'

import Home from './pages/Home'
import NewRoom from './pages/NewRoom'

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<Route path="/" exact component={Home} />
				<Route path="/rooms/new" component={NewRoom} />
			</AuthContextProvider>
		</Router>
	)
}

export default App
