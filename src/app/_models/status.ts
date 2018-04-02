export class Option {
    value: string;

    constructor(item) {
        this.value = item.value;
    }
}

export class Status {
    id: number;
    name: string;
    _type: number;
    isStatic: boolean;
    options: Option[];

    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this._type = item.type | item._type;
        this.isStatic = item.is_static;
        this.options = item.options ? item.options.map(element => new Option(element)) : [];
    }
    
    get type() {
        return 'status';
    }


    get object() {
        return {
            id: this.id,
            name: this.name,
            type: this._type,
            is_static: this.isStatic,
            options: this.options
        };
        
    }
}