import {useState} from "react";

export default function useTodo() {

  const [todos, setTodos] = useState([
    {
      text: "Learn about react",
      isCompleted: false
    },
    {
      text: "Learn about react2",
      isCompleted: true
    }
  ]);

  // useEffect(() => {
  //   console.log("hello,useEffect");
  //   return () => {
  //     console.log("out,useEffect");
  //   };
  // });

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
  return [todos, addTodo, completeTodo, deleteTodo];
}
