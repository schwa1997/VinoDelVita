import EditVineyardMap from '../map/EditVineyardMap';

import NotFoundPage from './components/404';

const EditVineyard = () => {
    const role = localStorage.getItem('role');
    return (
        <>
            {role === 'admin' || role === 'agronomists' ? (
                <NotFoundPage />
            ) : (
                <div id="form" className="tw-overflow-y-scroll">
                    <EditVineyardMap />
                </div>
            )}
        </>
    );
};
export default EditVineyard;
