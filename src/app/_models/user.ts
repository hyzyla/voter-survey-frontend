export class User {
    id: number;
    username: string;
    password: string;
    isStaff: boolean;
    isSuperuser: boolean;
    groups: number[];

    constructor(data) {
        this.username = data.username;
        this.groups = data.groups;
        this.isStaff = data.is_staff;
        this.isSuperuser = data.is_superuser;
    }
}