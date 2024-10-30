import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { v4 as uuidv4 } from 'uuid';
import EditTodoForm from './EditTodoForm';
import supabase from '../database';
uuidv4();

export const TodoWrapper = ({ session }) => {
	const [user, setUser] = useState(session?.user ?? null);
	const [todos, setTodos] = useState([]);

	// Set user
	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	// Retrieve todos from database
	useEffect(() => {
		if (user) {
			fetchTodos();
		}
	}, [user]);

	const fetchTodos = async () => {
		if (!user) return;
		try {
			const { data, error } = await supabase
				.from('todos')
				.select('*')
				.eq('user_id', user.id);
			if (error) throw error;
			setTodos(data);
		} catch (error) {
			console.error('Error fetching todos:', error);
		}
	};

	const addTodo = async (todo) => {
		if (!user) return;
		try {
			const newTodo = {
				id: uuidv4(),
				task: todo,
				completed: false,
				is_editing: false,
				user_id: user.id,
			};
			const { data, error } = await supabase
				.from('todos')
				.insert(newTodo)
				.select();
			if (error) throw error;
			setTodos([...todos, data[0]]);
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	};

	const toggleComplete = async (id) => {
		try {
			const todoToUpdate = todos.find((todo) => todo.id === id);
			const { data, error } = await supabase
				.from('todos')
				.update({ completed: !todoToUpdate.completed })
				.eq('id', id)
				.select();
			if (error) throw error;
			setTodos(todos.map((todo) => (todo.id === id ? data[0] : todo)));
		} catch (error) {
			console.error('Error udpating todo:', error);
		}
	};

	const deleteTodo = async (id) => {
		try {
			const { error } = await supabase
				.from('todos')
				.delete()
				.eq('id', id);
			if (error) throw error;
			setTodos(todos.filter((todo) => todo.id !== id));
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	};

	const editTodo = async (id) => {
		try {
			const todoToEdit = todos.find((todo) => todo.id === id);
			const { data, error } = await supabase
				.from('todos')
				.update({ is_editing: !todoToEdit.is_editing })
				.eq('id', id)
				.select();
			if (error) throw error;
			setTodos(
				todos.map((todo) =>
					todo.id === id
						? {
								...todo,
								isEditing: !todo.isEditing,
								completed: todo.completed,
							}
						: todo
				)
			);
		} catch (error) {
			console.error('Error updating todo edit state:', error);
		}
	};

	const editTask = async (task, id) => {
		try {
			const todoToEdit = todos.find((todo) => todo.id === id);
			const { data, error } = await supabase
				.from('todos')
				.update({ task, is_editing: false })
				.eq('id', id)
				.select();
			if (error) throw error;
			setTodos(todos.map((todo) => (todo.id === id ? data[0] : todo)));
		} catch (error) {
			console.error('Error updating todo:', error);
		}
	};

	// View
	return (
		<div className='todo-container'>
			<h1>Get Things Done!</h1>
			<TodoForm addTodo={addTodo} />
			{todos.map((todo, index) =>
				todo.isEditing ? (
					<EditTodoForm editTodo={editTask} task={todo} />
				) : (
					<Todo
						task={todo}
						key={index}
						toggleComplete={toggleComplete}
						deleteTodo={deleteTodo}
						editTodo={editTodo}
					/>
				)
			)}
		</div>
	);
};

export default TodoWrapper;
