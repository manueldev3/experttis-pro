import Routes from "@/models/routes";
import { NavLinksInterface } from "@/interfaces/navigation";

const links: NavLinksInterface[] = [
    {
        title: 'Clients',
        route: '#',
        sublinks: [
            {
                title: 'Subscriptions',
                route: '#'
            },
            {
                title: 'Sign in',
                route: '/clients/login'
            },
        ]
    },
    {
        title: 'Consultants',
        route: '#',
        sublinks: [
            {
                title: 'Registration',
                route: '/auth/register/consultants'
            },
            {
                title: 'Sign in',
                route: '/auth/login/consultants'
            },
        ]
    },
    {
        title: 'About',
        route: '#',
        sublinks: [
            {
                title: 'Foundation',
                route: '/foundations',
            },
            {
                title: 'How it works',
                route: '#',
            },
            {
                title: 'Fields',
                route: '#',
            },
            {
                title: 'Plans',
                route: '#',
            },
            {
                title: 'Why',
                route: '#',
            },
            {
                title: 'Assistance',
                route: '#',
            }
        ]
    },
    {
        title: 'Contact Us',
        route: '/contact'
    }
];

export default links;