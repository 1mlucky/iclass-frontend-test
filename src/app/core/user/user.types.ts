import { Todo } from "../todo/todo.types";

export interface User
{
    id: string;
    password?: string;
    email: string;
    todoList: Todo[]
}
