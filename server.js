const express = require('express');
const pool = require('./database');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/todos', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM todos');
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching todos:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Add new todo
app.post('/api/todos', async (req, res) => {
	const { id, task } = req.body;
	try {
		const result = await pool.query(
			'INSERT INTO todos (id, task) VALUES ($1, $2) RETURNING *',
			[id, task]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error('Error adding todo:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
	const { id } = req.params;
	const { task, completed } = req.body;
	try {
		const result = await pool.query(
			'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *',
			[task, completed, id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Todo not found' });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error updating todo:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Update is_editing state
app.patch('/api/todos/:id/edit', async (req, res) => {
	const { id } = req.params;
	const { is_editing } = req.body;
	try {
		const result = await pool.query(
			'UPDATE todos SET is_editing = $1 WHERE id = $2 RETURNING *',
			[is_editing, id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Todo not found' });
		}
		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error updating todo edit state:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Delete a todo
app.delete('/api/todo/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			'DELETE FROM todos WHERE id = $1 RETURNING *',
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Todo not found' });
		}
		res.json({ message: 'Todo deleted successfully' });
	} catch (error) {
		console.error('Error deleting todo:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
