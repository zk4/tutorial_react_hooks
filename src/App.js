import React, {useState, useEffect} from "react";
import TodoForm from './TodoForm'
import Todo from './Todo'
import "./App.css";


function App() {
  const [todos, setTodos] = useState([
    {
      text: "Learn about react",
      isCompleted: false
    },

    {
      text: "Learn about react2",
      isCompleted: true
    },

    {
      text: "Learn about react",
      isCompleted: false
    }
  ]);

  useEffect(() => {
    console.log("hello,useEffect");
    return () => {
      console.log("out,useEffect");
    };
  });

  const addTodo = text => {
    const NewTodos = [...todos, {text}];
    setTodos(NewTodos);
  };
  const completeTodo = index => {
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  };

  const deleteTodo = index => {
    let newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };
  return (
    <div className="app">
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
    </div>
  );
}

export default App;
