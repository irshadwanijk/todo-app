import cx from "classnames";

type ToDo = {
  id: string;
  value: string;
  done: boolean;
  isEdit: boolean;
};
type TodoList = {
  todos: Array<ToDo>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, isEdit: boolean) => void;
  saveTodo: (id: string, value: string) => void;
};

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  saveTodo,
}: TodoList) {
  return (
    <ul id="todo-list">
      {todos.map((todo) => {
        return !todo.isEdit ? (
          <li
            key={todo.id}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (!todo.isEdit) onEdit(todo.id, true);
            }}
            className={cx("todo", {
              "strike-todo": todo.done === true,
            })}
          >
            <button
              id="check-btn"
              type="button"
              className={cx("btn-unchecked ", {
                "btn-checked": todo.done === true,
              })}
              onClick={(e) => {
                e.preventDefault();
                onToggle(todo.id);
              }}
            >
              {todo.done ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                  <path
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="2"
                    d="M1 4.304L3.696 7l6-6"
                  />
                </svg>
              ) : null}
            </button>
            <p className="todo-text">{todo.value}</p>
            <button
              className="delete-todo"
              onClick={(e) => {
                e.preventDefault();
                onDelete(todo.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path
                  fill="#9d9d9e"
                  fillRule="evenodd"
                  d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                />
              </svg>
            </button>
          </li>
        ) : (
          <input
            // this is where the specific todo will be replaced with input tag when the user double clicks the todo
            autoFocus
            id="edit-todo"
            key={todo.id}
            type="text"
            value={todo.value}
            onChange={(e) => {
              saveTodo(todo.id, e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onEdit(todo.id, false);
              }
            }}
            onBlur={(e) => {
              e.preventDefault();
              onEdit(todo.id, false);
            }}
          />
        );
      })}
    </ul>
  );
}
