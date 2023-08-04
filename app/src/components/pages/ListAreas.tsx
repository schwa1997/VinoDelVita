import { useEffect, useState } from 'react';
import { Form, Select } from 'antd';

import { getAreas } from '@/server/api/apis';

import AreaMap from '../map/DisplayAreaMap';

import NotFoundPage from './components/404';

const ListAreas = () => {
    const role = localStorage.getItem('role');
    const [area, setArea] = useState(null); // Initialize 'area' with null
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    const handleAreaChange = (value: string) => {
        const selectedArea = areas.find((item) => item.id === value);
        setArea(selectedArea);
        console.log(selectedArea);
    };

    useEffect(() => {
        getAreas()
            .then((res) => {
                setAreas(res);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        // Add loading state handling, you can show a spinner or loading message
        return <div>Loading...</div>;
    }

    if (error) {
        // Add error state handling, display an error message or a fallback component
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="tw-h-full">
                {role === 'admin' || role === 'agronomists' ? (
                    <NotFoundPage />
                ) : (
                    <>
                        <div>
                            {area && <AreaMap area={area} />}
                            <div className="tw-flex tw-flex-col tw-fixed tw-top-32 tw-left-4 tw-gap-6">
                                <Form className="tw-flex-auto tw-bg-violet-300/70 hover:tw-bg-violet-300 tw-p-4 tw-rounded-md tw-shadow-md">
                                    <Form.Item
                                        name="Select Area"
                                        label="Select Area By Code"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Select something!',
                                            },
                                        ]}
                                    >
                                        <Select onChange={handleAreaChange}>
                                            {areas.map((item) => (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.code}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <p className="tw-font-bold">Vineyards:</p>
                                    <ul className="tw-list-disc">
                                        {area &&
                                            area.vineyards &&
                                            area.vineyards.map((item) => (
                                                <li key={item.id}>{item.name}</li>
                                            ))}
                                    </ul>
                                </Form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ListAreas;
