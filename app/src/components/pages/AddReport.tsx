import { useState } from 'react';
import { Button } from 'antd';

import ReportMap from '../map/CreateReportMap';

import NotFoundPage from './components/404';

const NewReport = () => {
    const role = localStorage.getItem('role');
    const [newReport, setNewReport] = useState(false);
    const handleNew = () => {
        setNewReport(true);
    };

    return (
        <>
            {role === 'admin' || role === 'agronomists' ? (
                <NotFoundPage />
            ) : (
                <div>
                    <Button
                        id="button"
                        className="tw-z-50 tw-border tw-fixed tw-top-44 md:tw-top-32 tw-right-2  tw-bg-gradient-to-r tw-from-violet-300 tw-via-purple-300 tw-to-violet-50  tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 tw-transition tw-duration-500 tw-ease select-none tw-hover:bg-indigo-600 tw-focus:outline-none tw-focus:shadow-outline"
                        onClick={handleNew}
                    >
                        Add Report
                    </Button>
                    {newReport && <ReportMap />}
                </div>
            )}
        </>
    );
};

export default NewReport;
