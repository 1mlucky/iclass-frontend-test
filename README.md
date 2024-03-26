# Angular Test

## Instrucions

Your task is to implement a simple web system that allows users to login and access to the to-dos list on dashboard page. The web system should be made accessible at `localhost:4200`.

## Tasks
1. Simple login page => Calling the mock api [Sign in function already provided in `AuthService`]
2. Adding a route makes `/dashboard` path access to `AdminDashboardComponent` component
3. Implement a middleware to make sure the `/dashboard` page not accessible when user not signed in.
4. Implement a simple todo list on the `/dashboard` page that allows users to add / update / delete the todo item.

## MockApi

The api is already embeded in the project.
The demo user login is:
email: demo@iclass.one
password: iclass

The following is the Todo List UI for reference:
![Todo List UI](https://www.callicoder.com/static/36e11cdc0d7a481fd6301f9aaa209b29/cf0be/spring-boot-mongodb-angular-rest-api-tutorial.png)