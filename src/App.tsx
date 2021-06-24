import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Github from './components/Github'
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

			<Toaster
			// position="top-center"
			// reverseOrder={false}
			// gutter={8}
			// containerClassName=""
			// containerStyle={{}}
			// toastOptions={{
			// 	// Define default options
			// 	className: '',
			// 	duration: 5000,
			// 	style: {
			// 		background: '#363636',
			// 		color: '#fff'
			// 	},
			// 	// Default options for specific types
			// 	success: {
			// 		duration: 3000,
			// 		theme: {
			// 			primary: 'green',
			// 			secondary: 'black'
			// 		}
			// 	}
			// }}
			/>

			<Github />
		</Router>
	)
}

export default App
