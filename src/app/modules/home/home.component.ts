import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector     : 'app-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [RouterLink],
})
export class LandingHomeComponent
{
    /**
     * Constructor
     */
    constructor(private authService: AuthService)
    {
    }
}
