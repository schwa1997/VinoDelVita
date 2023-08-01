import { useState } from 'react';
import { Button, Form } from 'antd';

import Header, { Theme } from '../header';
import AreaMap from '../map/CreateAreaMap';
import VineyardMap from '../map/CreateVineyardMap';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 5,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const NewInfo = () => {
    const [newArea, setNewArea] = useState(false);
    const [newVineyard, setNewVineyard] = useState(false);
    const handleNewArea = () => {
        setNewArea(true);
        setNewVineyard(false);
    };
    const handleNewVineary = () => {
        setNewVineyard(true);
        setNewArea(false);
    };
    return (
        <>
            <Theme>
                <Header />
                <div
                    id="form"
                    className="tw-container tw-w-1/2 tw-bg-customPurple/70 hover:tw-bg-customPurple tw-absolute tw-text-white tw-top-1/4 tw-left-1/4 tw-py-10 tw-px-2"
                >
                    <Form {...formItemLayout} name="vineyard infomation" scrollToFirstError>
                        <Form.Item
                            name="Select Vineyard"
                            label="Select:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Select something!',
                                },
                            ]}
                        >
                            <Button onClick={handleNewArea}>Add A New Area</Button>
                            <Button onClick={handleNewVineary}>Add A New Vineary</Button>
                        </Form.Item>
                    </Form>
                    {newArea && (
                        <>
                            <AreaMap />
                        </>
                    )}
                    {newVineyard && (
                        <>
                            <VineyardMap />
                        </>
                    )}
                </div>
            </Theme>
        </>
    );
};
export default NewInfo;
