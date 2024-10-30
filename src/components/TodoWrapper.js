import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { v4 as uuidv4 } from 'uuid';
import EditTodoForm from './EditTodoForm';
import supabase from '../database';

const CACHE_KEY = 'cachedTodos';

const MemoizedTodo = React.memo(Todo);
const MemoizedEditTodoForm = React.memo(EditTodoForm);

export const TodoWrapper = ({ session }) => {
  const [user, setUser] = useState(session?.user ?? null);
  const [todos, setTodos] = useState(() => {
    const cachedTodos = localStorage.getItem(CACHE_KEY);
    return cachedTodos ? JSON.parse(cachedTodos) : [];
  });

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
  const fetchTodos = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  // Update localStorage when todos change
  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(async (todo) => {
    if (!user) return;

    const newTodo = {
      id: uuidv4(),
      task: todo,
      completed: false,
      is_editing: false,
      user_id: user.id,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert(newTodo)
        .select();
      if (error) throw error;

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === newTodo.id ? data[0] : t))
      );
    } catch (error) {
      console.error('Error adding todo:', error);
      setTodos((prevTodos) =>
        prevTodos.filter((t) => t.id !== newTodo.id)
      );
    }
  }, [user]);

  const toggleComplete = useCallback(async (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo:', error);
      fetchTodos(); // Revert to server state on error
    }
  }, [todos, fetchTodos]);

  const deleteTodo = useCallback(async (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting todo:', error);
      fetchTodos(); // Revert to server state on error
    }
  }, [fetchTodos]);

  const editTodo = useCallback(async (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );

    try {
      const todoToEdit = todos.find((todo) => todo.id === id);
      const { error } = await supabase
        .from('todos')
        .update({ is_editing: !todoToEdit.is_editing })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo edit state:', error);
      fetchTodos(); // Revert to server state on error
    }
  }, [todos, fetchTodos]);

  const editTask = useCallback(async (task, id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: false } : todo
      )
    );

    try {
      const { error } = await supabase
        .from('todos')
        .update({ task, is_editing: false })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo:', error);
      fetchTodos(); // Revert to server state on error
    }
  }, [fetchTodos]);

  const memoizedTodoList = useMemo(() =>
    todos.map((todo) =>
      todo.isEditing ? (
        <MemoizedEditTodoForm
          key={todo.id}
          editTodo={editTask}
          task={todo}
        />
      ) : (
        <MemoizedTodo
          key={todo.id}
          task={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      )
    ),
    [todos, editTask, toggleComplete, deleteTodo, editTodo]
  );

  return (
    <div className='todo-container'>
      <h1 className='h1-todo'>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      {memoizedTodoList}
    </div>
  );
};

export default TodoWrapper;