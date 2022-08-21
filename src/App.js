import React from "react";
import TodoForm from './TodoForm'
import Todo from './Todo'
import useTodo from './useTodo'
import "./App.css";


function App() {
  const [todos,addTodo,completeTodo,deleteTodo] =  useTodo()
  // useEffect(() => {
  //   console.log("hello,useEffect");
  //   return () => {
  //     console.log("out,useEffect");
  //   };
  // });
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
