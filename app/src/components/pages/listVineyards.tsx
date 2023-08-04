import ListVineyards from '../map/ListVineyard';

import ListVineyardsAsAgronomist from './Agronomists/AgoDisplayVineyards';

const ListVineyardByRoles = () => {
    const role = localStorage.getItem('role');
    return (
        <>
            {role === 'admin' || role === 'agronomists' ? (
                <ListVineyardsAsAgronomist />
            ) : (
                <div id="form" className="tw-overflow-y-scroll">
                    <ListVineyards />
                </div>
            )}
        </>
    );
};
export default ListVineyardByRoles;
