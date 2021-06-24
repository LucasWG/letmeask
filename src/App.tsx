import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContext'
import AdminRoom from './pages/AdminRoom'
import Home from './pages/Home'
import NewRoom from './pages/NewRoom'
import Room from './pages/Room'

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/rooms/new" component={NewRoom} />
					<Route path="/rooms/:id" component={Room} />

					<Route path="/admin/rooms/:id" component={AdminRoom} />

					<Route path="*" component={Home} />
				</Switch>
			</AuthContextProvider>

			<Toaster />
		</Router>
	)
}

export default App
