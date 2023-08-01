import { useState } from 'react';
import { Button } from 'antd';

import Header, { Theme } from '../header';
import ReportMap from '../map/ReportMap';

const NewReport = () => {
    const [newReport, setNewReport] = useState(false);
    const handleNew = () => {
        setNewReport(true);
    };
    return (
        <>
            <Theme>
                <Header />
                <Button
                    id="button"
                    className="tw-z-50 tw-border tw-fixed tw-top-32 tw-right-2 tw-border-indigo-500 tw-bg-customPurple tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                    onClick={handleNew}
                >
                    Add Report
                </Button>
                {newReport && <ReportMap />}
            </Theme>
        </>
    );
};
export default NewReport;
