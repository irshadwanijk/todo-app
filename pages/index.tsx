import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import TodoList from "./components/todolist";
import { KeyboardEventHandler, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";

type ToDo = {
  id: string;
  value: string;
  done: boolean;
  isEdit: boolean;
};

const btnList = ["All", "Active", "Completed"] as const;
// Buttons in footer which filter todos based on currently button clicked
const Home: NextPage = () => {
  const [todos, setTodos] = useState<Array<ToDo>>([]);
  // State for the todos which is begin entered
  const [todoInput, setTodoInput] = useState("");
  // Temporary state for the todo input and after user presses enter then todo is added to todo state.
  const [visibleStatus, setVisibleStatus] =
    useState<typeof btnList[number]>("All");
  // This is the state for filter buttons based on this we set the classNames and filter the todos and send it the child component <TodoList/>

  const addTodo: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // function saves todo to the todos state.
    if (e.key === "Enter" && todoInput) {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: uuidv4().slice(0, 8),
          value: todoInput,
          done: false,
          isEdit: false,
        },
      ]);
      setTodoInput("");
    }
  };

  function deleteCompleted() {
    // Deleted those todos which are completed.
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.done === false));
  }

  const todosToRender = useMemo(() => {
    // useMemo hook is used to prevent from filtering and calculating the todos after every render. It will only filter if there is any change in the
    // visibleStatus state or todos state
    if (visibleStatus === "Active") {
      return todos.filter((todo) => todo.done === false);
    } else if (visibleStatus === "Completed") {
      return todos.filter((todo) => todo.done === true);
    }

    return todos;
  }, [todos, visibleStatus]);

  const onToggle = (id: string) => {
    // this function changes "done" value of the specific todo if checked or unchecked
    const tempTodos = [...todos];
    const todoIndex = tempTodos.findIndex((todo) => todo.id === id);
    tempTodos[todoIndex].done = !tempTodos[todoIndex].done;
    setTodos(tempTodos);
  };

  const onDelete = (id: string) => {
    // This deletes todo when delete button is pressed
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const onEdit = (id: string, isEdit: boolean) => {
    // This will run when we double tap any todo instead of todo input element will be replace in place of clicked todo
    const tempTodos = [...todos];
    const todoIndex = tempTodos.findIndex((todo) => todo.id === id);
    tempTodos[todoIndex].isEdit = !tempTodos[todoIndex].isEdit;
    setTodos(tempTodos);
  };
  const saveTodo = (id: string, value: string) => {
    // This will save todo after editing the  existing todo
    const tempTodos = [...todos];
    const todoIndex = tempTodos.findIndex((todo) => todo.id === id);
    tempTodos[todoIndex].value = value;
    setTodos(tempTodos);
    console.log(todos);
  };

  return (
    <div className={styles.container}>
      <div className="app">
        <div className="container">
          <div className="todo-app">
            <div>
              {/* Heading part of todo */}
              <h2 className="heading"> TODO</h2>
              <p className="sun-svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                  <path
                    fill="#FFF"
                    fillRule="evenodd"
                    d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
                  />
                </svg>
              </p>
            </div>
            <div>
              {/* this is where we insert the text of todo */}
              <input
                id="add-todo"
                value={todoInput}
                type="text"
                placeholder="Enter todo here"
                onChange={(e) => {
                  e.preventDefault();
                  setTodoInput(e.target.value);
                }}
                onKeyPress={addTodo}
              />
            </div>
            <div className="todo-list-container">
              {/* This is where todo list will be rendered */}
              {todos.length > 0 && (
                // It will render todo list and we the props which are needed to render the currently needed todos
                <TodoList
                  todos={todosToRender}
                  // this todosToRender will render the currently pressed filter button
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  saveTodo={saveTodo}
                />
              )}
              {todosToRender.length ? (
                // This will run when the width of the screen is less than 600px
                <div className="items-left-competed-mbl">
                  <span className="footer-btn">{todos.length} items left </span>{" "}
                  <button className="footer-btn" onClick={deleteCompleted}>
                    Clear Completed
                  </button>
                </div>
              ) : null}
              {todos.length > 0 && (
                <div id="footer">
                  {/* This the footer where all the filter and all other buttons reside */}
                  <div className="item-comp-btn">
                    <p>{todos.length} items left </p>
                  </div>

                  <div className="footer-fltr-btns">
                    {btnList.map((btn) => {
                      return (
                        <button
                          key={btn}
                          className={cx("footer-btn", {
                            "curr-fltr-btn": btn === visibleStatus,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setVisibleStatus(btn);
                          }}
                        >
                          <a>{btn}</a>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <button
                      className="footer-btn item-comp-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteCompleted();
                      }}
                    >
                      Clear Completed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
