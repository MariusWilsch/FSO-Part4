import { useState, useEffect } from 'react';
import { LoginForm, BlogList, Notification, BlogForm } from './components';
import blogService from './services/blogs';
import loginService from './services/login';

const localStorageKey = 'loggedUser';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUser = window.localStorage.getItem(localStorageKey);
		if (!loggedUser) return;
		const user = JSON.parse(loggedUser);
		setUser(user);
		blogService.setToken(user.token);
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem(localStorageKey, JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setErrorMessage('Wrong credentials');
			setTimeout(() => setErrorMessage(null), 5000);
		}
	};

	const handleLogout = (event) => {
		event.preventDefault();
		window.localStorage.removeItem(localStorageKey);
		setUser(null);
	};

	return (
		<div>
			<Notification msg={errorMessage} />
			<h2>blogs</h2>
			<LoginForm
				user={user}
				username={username}
				password={password}
				setUsername={setUsername}
				setPassword={setPassword}
				handleLogin={handleLogin}
			/>
			<BlogList user={user} blogs={blogs} handleLogout={handleLogout} />
			<BlogForm
				blogs={blogs}
				setBlogs={setBlogs}
				setErrorMessage={setErrorMessage}
			/>
		</div>
	);
};

export default App;
