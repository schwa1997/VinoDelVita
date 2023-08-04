/* eslint-disable no-nested-ternary */
import {
    JSXElementConstructor,
    ReactElement,
    ReactFragment,
    ReactPortal,
    useEffect,
    useState,
} from 'react';
import { Button, Pagination, Select } from 'antd';

import { getAllReportsAsAdmin, getAllVineyardsAsAgronomists } from '@/server/api/apis';

import { ReportCard } from '../components/ReportCard';

const ListReportsAsAgronomist = () => {
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemCount, setItemCount] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [vineyards, setVineyards] = useState([]);
    const [vineyard, setVineyard] = useState('');
    console.log('reports', reports, 'currentPage', currentPage);
    const handleVineYardsOption = (value: string) => {
        setVineyard(value);
    };
    const handleCurrent = (current: number) => {
        setCurrentPage(current);
    };
    const handleAllReports = () => {
        setVineyard('');
    };
    useEffect(() => {
        getAllReportsAsAdmin('createdAt', vineyard, currentPage).then((res) => {
            setReports(res.items);
            setItemCount(res.meta.totalItems);
            setPerPage(res.meta.perPage);
        });
    }, [currentPage, vineyard]);

    useEffect(() => {
        getAllVineyardsAsAgronomists().then((res) => {
            setVineyards(res);
        });
    }, []);
    return (
        <>
            <div>
                <div className="md:tw-grid md:tw-grid-flow-row md:tw-pt-32 tw-pt-44 tw-pb-32">
                    <div className="tw-overflow-y-auto tw-grid tw-grid-flow-row tw-gap-5 md:tw-overflow-x-auto md:tw-grid md:tw-grid-flow-col md:tw-p-10 md:tw-gap-4">
                        {reports.map((item) => (
                            <ReportCard
                                id={item.id}
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                disease={item.disease}
                                area={item.area}
                                vineyard={item.vineyard}
                            />
                        ))}
                    </div>
                </div>
                <div
                    id="pagination"
                    className="tw-text-black tw-bg-gradient-to-r tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 hover:tw-bg-customPurple tw-w-screen tw-bottom-0 tw-left-0 tw-h-fit tw-gap-6 tw-fixed md:tw-bottom-0 tw-z-50 tw-text-center tw-pt-4"
                >
                    <Pagination
                        total={itemCount}
                        showQuickJumper
                        responsive
                        showTotal={(total) => `Total ${total} reports`}
                        className="tw-text-lg "
                        pageSize={perPage}
                        onChange={(current) => handleCurrent(current)}
                    />
                    <div className="tw-grid tw-grid-cols-3 tw-px-12 tw-gap-0">
                        <Button id="button" className="tw-z-50 tw-w-fit" onClick={handleAllReports}>
                            All Reports
                        </Button>
                        <p className="tw-text-lg"> Select Report By Vineyards: </p>

                        <Select
                            onChange={(value) => handleVineYardsOption(value)}
                            defaultActiveFirstOption
                            className="tw-text-lg"
                        >
                            {vineyards.map(
                                (item: {
                                    id: string | undefined;
                                    name:
                                        | string
                                        | number
                                        | boolean
                                        | ReactElement<any, string | JSXElementConstructor<any>>
                                        | ReactFragment
                                        | ReactPortal
                                        | null
                                        | undefined;
                                }) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ),
                            )}
                        </Select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListReportsAsAgronomist;
