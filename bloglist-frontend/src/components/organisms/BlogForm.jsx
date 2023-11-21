import React from 'react';
import { LabeledInput } from '../molecules/labeledInput';
import { useState } from 'react';
import blogService from 'src/services/blogs';
import { Button } from '../atoms/button';

/**
 * @typedef {Object} Form
 * @property {string} title - The title of the blog post.
 * @property {string} author - The author of the blog post.
 * @property {string} url - The URL of the blog post.
 */
export const BlogForm = ({ blogs, setBlogs, setErrorMessage }) => {
	const [form, setForm] = useState({
		title: '',
		author: '',
		url: '',
	});

	const handleInput = async (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await blogService.create(form);
			setBlogs([...blogs, res]);
			setForm({ title: '', author: '', url: '' });
			setErrorMessage(`a new blog ${res.title} by ${res.author} added`);
			setTimeout(() => setErrorMessage(null), 5000);
		} catch (error) {
			setErrorMessage(error.message);
			setTimeout(() => setErrorMessage(null), 5000);
		}
	};

	return (
		<div>
			<h2>create new</h2>
			<LabeledInput
				label="Title"
				type="text"
				name="title"
				value={form.title}
				onChange={handleInput}
			/>
			<LabeledInput
				label="Author"
				type="text"
				name="author"
				value={form.author}
				onChange={handleInput}
			/>
			<LabeledInput
				label="Url"
				type="text"
				name="url"
				value={form.url}
				onChange={handleInput}
			/>
			<Button type="submit" text="create" onClick={handleSubmit} />
		</div>
	);
};
