import Header, { Theme } from '../header';
import MarksVineyardsAsAgronomist from '../map/AgoDisplayVineyards';

import NotFoundPage from './404';

const ListVineyardsAsAgronomist = () => {
    const role = localStorage.getItem('role');
    return (
        <>
            <Theme>
                <div className="tw-h-full">
                    <Header />
                    {role === 'admin' || role === 'agronomists' ? (
                        <MarksVineyardsAsAgronomist />
                    ) : (
                        <NotFoundPage />
                    )}
                </div>
            </Theme>
        </>
    );
};

export default ListVineyardsAsAgronomist;
