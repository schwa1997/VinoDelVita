import { useEffect, useState } from 'react';

import { Form, Select } from 'antd';

import { getAreas } from '@/server/api/apis';

import Header, { Theme } from '../header';
import MarksMap from '../map/marksMap';

const ListMarks = () => {
    const [area, setArea] = useState();
    const [areas, setAreas] = useState([]);
    const handleAreaChange = (value: string) => {
        const selectedArea = areas.find((item) => item.id === value);
        setArea(selectedArea);
        console.log(selectedArea);
    };
    useEffect(() => {
        getAreas().then((res) => {
            setAreas(res);
        });
    }, []);
    return (
        <>
            <Theme>
                <div className="tw-h-full">
                    <Header />
                    {area && <MarksMap area={area} />}
                    <Form.Item
                        className="tw-z-50 tw-fixed tw-top-1/4 tw-left-4 tw-w-32 tw-bg-violet-300"
                        name="Select Area"
                        label="Select Area"
                        rules={[
                            {
                                required: true,
                                message: 'Select something!',
                            },
                        ]}
                    >
                        <Select onChange={handleAreaChange}>
                            {areas.map(
                                (
                                    item, // Remove the 'index' argument since it's not needed
                                ) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {' '}
                                        {item.code}
                                    </Select.Option>
                                ),
                            )}
                        </Select>
                    </Form.Item>
                </div>
            </Theme>
        </>
    );
};

export default ListMarks;
