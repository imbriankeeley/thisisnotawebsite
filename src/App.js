import { useState, useEffect } from 'react';
import supabase from './database';
import { TodoWrapper } from './components/TodoWrapper';
import Auth from './components/Auth';
import './App.css';

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<div className='App'>
			{!session ? <Auth /> : <TodoWrapper session={session} />}
		</div>
	);
}

export default App;
