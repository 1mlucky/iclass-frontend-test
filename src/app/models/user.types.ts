import { Todo } from "./todo.types";

export interface User
{
    id: string;
    password?: string;
    email: string;
    todoList: Todo[]
}
