import { MurrayDash } from "./components/MurrayDash";

const AppRoutes = [
    {
        index: true,
        element: <MurrayDash />
    },
    {
        path: '/murraydash',
        element: <MurrayDash />
    }
];

export default AppRoutes;
