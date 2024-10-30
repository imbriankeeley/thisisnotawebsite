import { useState } from 'react';
import supabase from '../database';

export default function Auth() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				redirectTo: window.location.origin,
			},
		});
		if (error) {
			alert(error.error_description || error.message);
		} else {
			alert('Check your email for the login link!');
		}
		setLoading(false);
	};

	return (
		<div className='auth-container'>
			<h1 className='h1-form'>Login</h1>
			<form className='auth-form' onSubmit={handleLogin}>
				<input
					className='input-form'
					type='email'
					placeholder='Your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button
					className='button-form'
					type='submit'
					disabled={loading}
				>
					{loading ? 'Loading' : 'Send magic link'}
				</button>
			</form>
		</div>
	);
}
