export class Region {
    id: number;
    url: string;
    districts: string;
    constituencies: string;
    name: string;

    constructor(item) {
        this.id = item.id;
        this.url = item.url;
        this.districts = item.districts;
        this.constituencies = item.constituencies;
        this.name = item.name;
    }

    get type() {
        return 'region';
    }
}

export class District {
    id: number;
    region: number;
    stations: string;
    name: string;
    city: string | null;

    constructor(item) {
        this.id = item.id;
        this.region = item.region;
        this.stations = item.stations;
        this.name = item.name;
        this.city = item.city;
    }

    get type() {
        return 'district';
    }

}

export class Station {
    id: number;
    number: string;
    description: string;
    address: string;
    district: number | null;
    constituency: string | null;

    constructor(item) {
        this.id = item.id;
        this.number = item.number;
        this.description = item.description;
        this.address = item.address;
        this.district = item.district;
        this.constituency = item.constituency;
    }

    get type() {
        return 'station';
    }

    get name() {
        return this.number;
    }
}


export class Constituency {
    id: number;
    stations: string;
    name: string;
    description: string;
    year: number;
    constructor(item) {
        this.id = item.id;
        this.stations = item.stations;
        this.name = item.name;
        this.description = item.description;
        this.year = item.year;
    }
    
    get type() {
        return 'constituency'
    }

    get pname() {
        if (this.year) {
            return `${this.name} (${this.year})`
        } else {
            return this.name
        }
        
    }
}