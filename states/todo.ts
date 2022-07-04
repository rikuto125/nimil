import { atom, atomFamily, DefaultValue, selector, selectorFamily, useRecoilCallback, useRecoilValue } from "recoil";

type TodoId = number;
type TodoTitle = string;
type TodoDescription = string;
type TodoIsDone = boolean;

type Todo = {
  id: TodoId;
  title: TodoTitle;
  description?: TodoDescription;
  isDone: TodoIsDone;
};

const stateTodoTitle = atomFamily<TodoTitle, TodoId>({
  key: "state-todo-title",
  default: selectorFamily<string, TodoId>({
    key: "state-todo-title-default-value",
    get: (todoId) => () => {
      return `todo-${todoId}`;
    },
  }),
});

const stateTodoDescription = atomFamily<TodoDescription, TodoId>({
  key: "state-todo-description",
  default: "",
});

const stateTodoIsDone = atomFamily<TodoIsDone, TodoId>({
  key: "state-todo-is-done",
  default: false,
});

const stateTodo = selectorFamily<Todo, TodoId>({
  key: "state-todo",
  get:
    (todoId) =>
    ({ get }) => {
      return {
        id: todoId,
        title: get(stateTodoTitle(todoId)),
        description: get(stateTodoDescription(todoId)),
        isDone: get(stateTodoIsDone(todoId)),
      };
    },

  set:
    (todoId) =>
    ({ get, set, reset }, newValue) => {
      if (newValue instanceof DefaultValue) {
        reset(stateTodoTitle(todoId));
        reset(stateTodoDescription(todoId));
        reset(stateTodoIsDone(todoId));
        return;
      }

      if (newValue.title) set(stateTodoTitle(todoId), newValue.title);
      if (newValue.description) set(stateTodoDescription(todoId), newValue.description);
      set(stateTodoIsDone(todoId), newValue.isDone);

      if (!get(stateTodoIds).find((todoId) => todoId === newValue.id)) {
        set(stateTodoIds, (prev) => [...prev, newValue.id]);
      }
    },
});

const stateTodoIds = atom<TodoId[]>({
  key: "state-todo-ids",
  default: [],
});

const stateTodos = selector<Todo[]>({
  key: "state-todos",
  get: ({ get }) => {
    const todoIds = get(stateTodoIds);
    return todoIds.map((todoId) => get(stateTodo(todoId)));
  },
});

export const useTodo = () => {
  const todos = useRecoilValue(stateTodos);

  const setFromArray = useRecoilCallback(({ set }) => (todoArray: Todo[]) => {
    todoArray.forEach((todo) => {
      set(stateTodo(todo.id), todo);
    });
  });

  const newTodo = useRecoilCallback(({ set }) => (title: TodoTitle, description?: TodoDescription) => {
    const id = new Date().getTime();
    set(stateTodo(id), { id, title, description, isDone: false });
  });

  const checkTodo = useRecoilCallback(({ set }) => (todoId: TodoId) => {
    set(stateTodo(todoId), (prev) => ({ ...prev, isDone: !prev.isDone }));
  });

  const removeTodo = useRecoilCallback(({ set, reset }) => (todoId: TodoId) => {
    reset(stateTodo(todoId));
    set(stateTodoIds, (prev) => prev.filter((id) => id !== todoId));
  });

  return { todos, setFromArray, newTodo, checkTodo, removeTodo };
};
