import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector     : 'admin-dashboard',
    templateUrl  : './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [RouterLink],
})
export class AdminDashboardComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
