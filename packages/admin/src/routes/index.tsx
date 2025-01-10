import { useRoutes, useMatches } from 'react-router';
import { createHashRouter } from 'react-router-dom';

const A = () => {
    console.log(useMatches(), 'sdsd')
    return (
        <div>A</div>
    )
}
const B = () => {
    console.log(useMatches(), 'sdsd')
    return (
        <div>B</div>
    )
}

const C = () => {
    return (
        <div>C</div>
    )
}

const routes = createHashRouter([
    {
        path: '/',
        children: [
            {
                index: true,
                element: <A />,
            },
            {
                path: '/b',
                element: <B />,
                handle: {
                    bead: '1212'
                }
            },
            {
                path: '/c',
                element: <C />,
            },
        ]
    },
]);

console.log(routes)

export default routes;