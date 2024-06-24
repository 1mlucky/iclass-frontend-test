import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Observable, of, throwError } from 'rxjs';
import { userData } from '../../data/userData';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { HmacSHA256 } from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;

    public errors = {
        UNAUTHORIZED: "Not authorized !!"
    }

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
    ) {
        this._userService = _userService

        const strToken = this.accessToken

        this._authenticated = !!strToken && strToken != ""
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (credentials.email == userData.email && credentials.password == 'demo') {

            if (this._authenticated) {
                return throwError('Already logged in.');
            }

            this.accessToken = this._generateJWTToken();
            this._authenticated = true;

            return of([
                200,
                {
                    user: this._userService.user,
                    accessToken: this.accessToken,
                    tokenType: 'bearer',
                },
            ]);
        } else {
            return of([
                400,
                false
            ]);
        }
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    checkAuthenticated(): boolean {
        return this._authenticated
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return of(true);
    }

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);
        encodedSource = encodedSource.replace(/=+$/, '');
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    private _generateJWTToken(): string {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        // expire date time
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'iClass',
            exp: exp,
        };

        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, 'iclassdemo');
        signature = this._base64url(signature);

        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

}
