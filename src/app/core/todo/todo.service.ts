import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from 'app/models/todo.types';
import { distinctUntilChanged, first, last, max, Observable, of, ReplaySubject, scan, tap, throwError } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { mergeMap, map, distinct, filter } from 'rxjs';
import { User } from '../../models/user.types';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TodoService {

    private _todoIdCounter = 0
    private _userService: UserService
    private _authService: AuthService;

    /**
     * Constructor
     */
    constructor(
        _userService: UserService,
        _authService: AuthService
    ) {
        this._userService = _userService
        this._authService = _authService

        this.todoList$
            .pipe(mergeMap(todoList => todoList))
            .pipe(map(todo => Number(todo.id)))
            .pipe(scan((prev, curr) => Math.max(prev, curr), 0))
            .pipe(distinctUntilChanged())
            .subscribe(id => (this._todoIdCounter = id + 1))

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * CRUD on todo
     */
    addTodo(todoValue: Todo["value"]): number | null {

        if (!!!todoValue || todoValue == "") return null;

        if (this._authService.checkAuthenticated()) {

            this._todoIdCounter += 1;

            const _user = this._userService.user

            _user.todoList.push({
                id: this._todoIdCounter,
                value: todoValue,
                isCompleted: false,
                isDeleted: false,
                createdAt: new Date().getTime()
            })

            this._userService.user = _user

            return this._todoIdCounter

        } else {

            throw new Error(this._authService.errors.UNAUTHORIZED)

        }

    }

    updateTodo(todo: Todo): void {

        if (this._authService.checkAuthenticated()) {

            const _user = this._userService.user

            Object.assign(
                _user.todoList.find((_todo: Todo) => _todo.id == todo.id) ?? {},
                {
                    value: todo.value
                }
            )

            this._userService.user = _user

        } else {

            throw new Error(this._authService.errors.UNAUTHORIZED)

        }

    }

    deleteTodo(todo: Todo): void {

        if (this._authService.checkAuthenticated()) {

            const _user = this._userService.user

            Object.assign(
                _user.todoList.find((_todo: Todo) => _todo.id == todo.id) ?? {},
                {
                    isDeleted: true
                }
            )

            this._userService.user = _user

        } else {

            throw new Error(this._authService.errors.UNAUTHORIZED)

        }

    }

    completeTodo(todo: Todo): void {

        if (this._authService.checkAuthenticated()) {

            const _user = this._userService.user

            Object.assign(
                _user.todoList.find((_todo: Todo) => _todo.id == todo.id) ?? {},
                {
                    isCompleted: true
                }
            )

            this._userService.user = _user

        } else {

            throw new Error(this._authService.errors.UNAUTHORIZED)

        }
    }

    unCompleteTodo(todo: Todo): void {

        if (this._authService.checkAuthenticated()) {

            const _user = this._userService.user

            Object.assign(
                _user.todoList.find((_todo: Todo) => _todo.id == todo.id) ?? {},
                {
                    isCompleted: false
                }
            )

            this._userService.user = _user

        } else {

            throw new Error(this._authService.errors.UNAUTHORIZED)

        }
    }

    get todoList$(): Observable<Todo[]> {

        if (this._authService.checkAuthenticated()) {

            return this._userService.user$
                .pipe(map((user: User) => {

                    return user.todoList
                        .filter((todo: Todo) => !todo.isDeleted)
                        .sort(
                            (todo1: Todo, todo2: Todo) => todo2.createdAt - todo1.createdAt
                        )
                }))

        } else {

            return throwError(this._authService.errors.UNAUTHORIZED);
        }
    }

}
