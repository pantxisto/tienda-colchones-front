export class User {
    _id: string;
    email: string;
    username: string;
    password: string;
    role: string;

    constructor(_id = '', email = '', username = '', password = '', role = '') {
        this._id = _id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
