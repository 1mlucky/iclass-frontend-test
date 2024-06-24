import { Component, OnChanges, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from 'app/core/todo/todo.service';
import { Todo } from 'app/models/todo.types';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterLink,
        CommonModule
    ],
})
export class AdminDashboardComponent {

    public _todoInput: string = ""
    public _todoList: Todo[] = []
    public _todoService: TodoService
    public _authService: AuthService
    /**
     * Constructor
     */
    constructor(
        todoService: TodoService,
        authService: AuthService,
        private router: Router
    ) {
        this._authService = authService

        if (!this._authService.checkAuthenticated()) {
            this.router.navigateByUrl("/home");
        }

        this._todoService = todoService
        todoService.todoList$.subscribe((todoList: Todo[]) => {
            this._todoList = todoList
        })

    }

    logout() {
        this._authService.signOut()
        this.router.navigateByUrl("/home");
    }

    onTodoInputValueChange(event: any) {
        let value = (<HTMLInputElement>event.target).value;
        this._todoInput = value
    }

    addTodo(event: any) {
        let value = (<HTMLInputElement>event.target).value;
        this._todoService.addTodo(value)
        this._todoInput = ""
    }

    deleteTodo(todo: Todo) {
        this._todoService.deleteTodo(todo)
    }

    updateTodo(todo: Todo) {
        this._todoService.updateTodo(todo)
    }

    completeTodo(todo: Todo) {
        this._todoService.completeTodo(todo)
    }

    unCompleteTodo(todo: Todo) {
        this._todoService.unCompleteTodo(todo)
    }

}
