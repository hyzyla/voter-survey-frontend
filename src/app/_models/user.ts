export class User {
    id: number;
    username: string;
    password: string;
    is_staff: boolean;
    is_superuser: boolean;
    groups: number[];

    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.groups = data.groups;
        this.is_staff = data.is_staff;
        this.is_superuser = data.is_superuser;
    }
}