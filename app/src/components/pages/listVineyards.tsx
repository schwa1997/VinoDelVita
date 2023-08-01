import Header, { Theme } from '../header';
import MarksVineyards from '../map/DisplayVineyards';

const ListVineyards = () => {
    return (
        <>
            <Theme>
                <div className="tw-h-full">
                    <Header />
                    <MarksVineyards />
                </div>
            </Theme>
        </>
    );
};

export default ListVineyards;
