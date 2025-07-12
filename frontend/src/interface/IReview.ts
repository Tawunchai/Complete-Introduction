import type {UsersInterface} from "./IUser"

export interface ReviewInterface {
    ID?: number;
    Date?: string;
    Rating?:number;
    Comment?: string;
    User?: UsersInterface;
}