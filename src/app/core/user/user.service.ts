import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/models/user.types';
import { Observable, of, ReplaySubject } from 'rxjs';
import { userData } from '../../data/userData';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        this._user.subscribe((user: User) => {

            localStorage.setItem('user', JSON.stringify(user));

        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user(): User {

        const value = JSON.parse(localStorage.getItem('user') ?? JSON.stringify(userData));

        return value

    }

    get user$(): Observable<User> {

        const value = JSON.parse(localStorage.getItem('user') ?? JSON.stringify(userData));

        this._user.next(value);
        // this._user.next(value);

        return this._user.asObservable();
    }
}
