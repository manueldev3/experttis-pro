interface subLinksInterface {
    title: string;
    route: string;
}

export interface NavLinksInterface {
    title: string;
    route: string;
    sublinks?: subLinksInterface[];
}