import type { GenderInterface } from "./IGender";
import type { UserroleInterface } from "./IUserRole";

export interface UsersInterface {
    ID?: number;
    Username?: string;
    Password?:string;
    Email?: string;
    FirstName?:string;
    LastName?: string;
    PhoneNumber?:string;
    Profile?: string;
    UserRole?:UserroleInterface;
    Gender?:GenderInterface;
}