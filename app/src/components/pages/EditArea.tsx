import Header, { Theme } from '../header';
import EditAreaMap from '../map/EditAreaMap';

const EditArea = () => {
    return (
        <>
            <Theme>
                <Header />
                <div id="form" className="tw-overflow-y-scroll">
                    <EditAreaMap />
                </div>
            </Theme>
        </>
    );
};
export default EditArea;
