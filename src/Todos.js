import React, {useState} from 'react';
import TodoForm from './TodoForm'
import Todo from './Todo'
import useTodo from './useTodo'
import "./Todos.css";
function Todos(props) {
  const [todos,addTodo,completeTodo,deleteTodo] =  useTodo()
  return (
      <div className="todo-list">
        {todos.map((todo, index) => {
          return (
            <Todo
              key={index}
              index={index}
              todo={todo}
              completeTodo={completeTodo}
              deleteTodo={deleteTodo}
            />
          );
        })}
        <TodoForm addTodo={addTodo} />
      </div>
  );
}

export default Todos;
