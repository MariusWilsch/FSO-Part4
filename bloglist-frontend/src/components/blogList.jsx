import React from 'react';
import { Blog } from './Blog';

export const BlogList = ({ user, blogs, handleLogout }) => {
	if (!user) return;
	return (
		<div>
			<p>{user.name} logged in </p>
			<ul>
				{blogs.map((blog) => (
					<Blog key={blog.id} blog={blog} />
				))}
			</ul>
			<button type="submit" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};
