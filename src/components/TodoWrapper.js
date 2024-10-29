import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { v4 as uuidv4 } from 'uuid';
import EditTodoForm from './EditTodoForm';
import supabase from '../database';
uuidv4();

export const TodoWrapper = () => {
	const [todos, setTodos] = useState([]);

	// Retrieve todos from database
	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		try {
			const { data, error } = await supabase.from('todos').select('*');
			if (error) throw error;
			setTodos(data);
		} catch (error) {
			console.error('Error fetching todos:', error);
		}

		// try {
		// 	const response = await fetch('http://localhost:3001/api/todos');
		// 	if (!response.ok) {
		// 		throw new Error('Failed to fetch todos');
		// 	}
		// 	const data = await response.json();
		// 	setTodos(data);
		// } catch (error) {
		// 	console.error('Error fetching todos:', error);
		// }
	};

	const addTodo = async (todo) => {
		try {
			const newTodo = {
				id: uuidv4(),
				task: todo,
				completed: false,
				is_editing: false,
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

		// try {
		// 	const response = await fetch('http://localhost:3001/api/todos', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify({ id: uuidv4(), task: todo }),
		// 	});
		// 	if (!response.ok) {
		// 		throw new Error('Failed to add todo');
		// 	}
		// 	const newTodo = await response.json();
		// 	setTodos([...todos, newTodo]);
		// } catch (error) {
		// 	console.error('Error adding todo:', error);
		// }
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

		// try {
		// 	const todoToUpdate = todos.find((todo) => todo.id === id);
		// 	const response = await fetch(
		// 		`http://localhost:3001/api/todos/${id}/completed`,
		// 		{
		// 			method: 'PATCH',
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 			},
		// 			body: JSON.stringify({
		// 				...todoToUpdate,
		// 				completed: !todoToUpdate.completed,
		// 			}),
		// 		}
		// 	);
		// 	if (!response.ok) {
		// 		throw new Error('Failed to update todo complete status');
		// 	}
		// 	setTodos(
		// 		todos.map((todo) =>
		// 			todo.id === id
		// 				? { ...todo, completed: !todo.completed }
		// 				: todo
		// 		)
		// 	);
		// } catch (error) {
		// 	console.error('Error updating todo:', error);
		// }
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

		// try {
		// 	const response = await fetch(
		// 		`http://localhost:3001/api/todo/${id}`,
		// 		{
		// 			method: 'DELETE',
		// 		}
		// 	);
		// 	if (!response.ok) {
		// 		throw new Error('Failed to delete todo');
		// 	}
		// 	setTodos(todos.filter((todo) => todo.id !== id));
		// } catch (error) {
		// 	console.error('Error deleting todo:', error);
		// }
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
			setTodos(todos.map((todo) => (todo.id === id ? data[0] : todo)));
		} catch (error) {
			console.error('Error updating todo edit state:', error);
		}

		// try {
		// 	const todoToEdit = todos.find((todo) => todo.id === id);
		// 	const response = await fetch(
		// 		`http://localhost:3001/api/todos/${id}/edit`,
		// 		{
		// 			method: 'PATCH',
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 			},
		// 			body: JSON.stringify({
		// 				is_editing: !todoToEdit.is_editing,
		// 				completed: todoToEdit.completed,
		// 			}),
		// 		}
		// 	);
		// 	if (!response.ok) {
		// 		throw new Error('Failed to update todo edit state');
		// 	}
		// 	setTodos(
		// 		todos.map((todo) =>
		// 			todo.id === id
		// 				? {
		// 						...todo,
		// 						isEditing: !todo.isEditing,
		// 						completed: todo.completed,
		// 					}
		// 				: todo
		// 		)
		// 	);
		// } catch (error) {
		// 	console.error('Error updating todo edit state:', error);
		// }
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

		// try {
		// 	const todoToEdit = todos.find((todo) => todo.id === id);
		// 	const response = await fetch(
		// 		`http://localhost:3001/api/todos/${id}`,
		// 		{
		// 			method: 'PUT',
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 			},
		// 			body: JSON.stringify({
		// 				task,
		// 				is_editing: todoToEdit.is_editing,
		// 				completed: todoToEdit.completed,
		// 			}),
		// 		}
		// 	);
		// 	if (!response.ok) {
		// 		throw new Error('Failed to update todo');
		// 	}
		// 	setTodos(
		// 		todos.map((todo) =>
		// 			todo.id === id
		// 				? { ...todo, task, isEditing: !todo.isEditing }
		// 				: todo
		// 		)
		// 	);
		// } catch (error) {
		// 	console.error('Error updating todo:', error);
		// }
	};

	// View
	return (
		<div className='TodoWrapper'>
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
