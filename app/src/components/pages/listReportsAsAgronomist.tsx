/* eslint-disable no-nested-ternary */
import {
    JSXElementConstructor,
    ReactElement,
    ReactFragment,
    ReactPortal,
    useEffect,
    useState,
} from 'react';
import { Card, Divider, Pagination, Select } from 'antd';

import { getAllVineyardsByUserID, paginateReports } from '@/server/api/apis';

import Header, { Theme } from '../header';

interface BasicCardProps {
    title: string;
    description: string;
    disease: string;
    area: string;
    vineyard: string;
}

const BasicCard: React.FC<BasicCardProps> = ({
    title,
    description,
    disease,

    area,
    vineyard,
}) => {
    return (
        <>
            <Card
                id="report-card"
                className="tw-bg-violet-300/80 hover:tw-bg-customPurple tw-rounded-tr-3xl tw-rounded-none tw-h-3/4 md:tw-w-full md:tw-min-w-full md:tw-left-0 tw-w-1/2 tw-left-1/4 md:tw-h-fit"
            >
                <div className="tw-inline-block tw-align-middle tw-font-bold tw-py-2 tw-w-full tw-bg-violet-500/50 tw-text-white tw-rounded-xl tw-text-center tw-text-base">
                    {title}
                </div>
                <Divider />
                <div className="tw-h-10">Disease: {disease}</div>
                <div className="tw-h-10">Description: {description}</div>
                <div className="tw-h-10">Area: {area}</div>
                <div className="tw-h-10">Vineyard: {vineyard}</div>
            </Card>
        </>
    );
};

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
    useEffect(() => {
        paginateReports('createdAt', vineyard, currentPage).then((res) => {
            setReports(res.items);
            setItemCount(res.meta.totalItems);
            setPerPage(res.meta.perPage);
        });
    }, [currentPage, vineyard]);

    useEffect(() => {
        getAllVineyardsByUserID().then((res) => {
            setVineyards(res);
        });
    }, []);
    return (
        <>
            <div>
                <Theme>
                    <Header />
                    <div className="md:tw-grid md:tw-grid-flow-row tw-pt-40">
                        <div className="tw-bg-customPurple tw-w-screen tw-bottom-0 md:tw-bg-violet-300/30 hover:tw-bg-customPurple tw-rounded-t-xl tw-fixed md:tw-bottom-0 tw-z-50 md:tw-w-1/2 md:tw-left-1/4 tw-text-center tw-py-1">
                            <Pagination
                                total={itemCount}
                                showQuickJumper
                                responsive
                                showTotal={(total) => `Total ${total} reports`}
                                className="tw-text-lg"
                                pageSize={perPage}
                                onChange={(current) => handleCurrent(current)}
                            />
                            <div className="tw-grid tw-grid-cols-2 tw-px-12 tw-gap-0">
                                <p className="tw-text-lg"> Select Report By Vineyards</p>
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
                                                | ReactElement<
                                                      any,
                                                      string | JSXElementConstructor<any>
                                                  >
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
                        <div className="tw-overflow-y-auto md:tw-overflow-x-auto md:tw-grid md:tw-grid-flow-col md:tw-p-10 tw-gap-6 ">
                            {reports.map((item) => (
                                <BasicCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    disease={item.disease}
                                    latitude={item.latitude}
                                    longitude={item.longitude}
                                    area={item.area.name}
                                    vineyard={item.vineyard.name}
                                />
                            ))}
                        </div>
                    </div>
                </Theme>
            </div>
        </>
    );
};

export default ListReportsAsAgronomist;
