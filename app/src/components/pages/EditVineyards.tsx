import { useEffect, useState } from 'react';
import { Button, Form, Input, Result, Select } from 'antd';

import { useNavigate } from 'react-router';

import { getAreaByID, getAreas, getVineyardByID, updateVineyard } from '@/server/api/apis';

import Header, { Theme } from '../header';
import { SmileOutlined } from '@ant-design/icons';
import EditVineyardMap from '../map/EditVineyardMap';

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 8,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 16,
        },
        sm: {
            span: 12,
        },
    },
};
interface GetVineyardProps {
    editState: boolean;
    data: {
        id: string;
        vineyardName: string;
        typeOfWine: string;
        AreaOrder: string;
        yearOfPlaning: string;
        area: {
            id: string;
            name: string;
        };
        longitude: string;
        latitude: string;
    };
    areas: Array<any>;
}

const GetVineyard: React.FC<GetVineyardProps> = ({ editState, data, areas }) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [typeOfWine, setTypeOfWine] = useState(data.typeOfWine);
    const [vineyardName, setVineyardName] = useState(data.vineyardName);
    const [AreaOrder, setAreaOrder] = useState(data.AreaOrder);
    const [yearOfPlaning, setYearOfPlaning] = useState(data.yearOfPlaning);
    const [area, setArea] = useState(data.area.id);
    const [longitude, setLongitude] = useState(data.longitude);
    const [latitude, setLatitude] = useState(data.latitude);
    const handleSubmit = () => {
        updateVineyard(
            data.id,
            vineyardName,
            typeOfWine,
            AreaOrder,
            yearOfPlaning,
            area,
            longitude,
            latitude,
        ).then((res) => {
            if (res) {
                setSuccess(true);
                navigate('/users/vineyards');
            }
        });
    };
    return (
        <div>
            {success ? (
                <Result
                    icon={<SmileOutlined rev={undefined} style={{ color: 'purple' }} />}
                    className="tw-z-50 tw-fixed  tw-left-1/4 tw-top-1/4 tw-rounded-lg tw-w-1/2 tw-bg-customPurple/80"
                    status="success"
                    title="Successfully Log Out"
                    extra={[
                        <>
                            <Button>
                                <a target="_self" href="/">
                                    Return to Home
                                </a>
                            </Button>
                            <Button>
                                <a target="_self" href="/users/login">
                                    Log In Again
                                </a>
                            </Button>
                        </>,
                    ]}
                />
            ) : (
                ''
            )}
            {editState ? (
                <Form
                    className="tw-z-40 tw-invisible"
                    {...formItemLayout}
                    name="vineyard infomation"
                    scrollToFirstError
                >
                    <Form.Item key="vineyardName" name="vineyardName" label="vineyardName">
                        <Input
                            placeholder="Vineyard Name"
                            value={vineyardName}
                            onChange={(event) => setVineyardName(event.target.value)}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="typeOfWine" name="typeOfWine" label="typeOfWine">
                        <Select
                            defaultActiveFirstOption
                            value={typeOfWine}
                            onChange={(value) => setTypeOfWine(value)}
                        >
                            <Select.Option value="Red Wine">Red Wine</Select.Option>
                            <Select.Option value="White Wine">White Wine</Select.Option>
                            <Select.Option value="Rosé Wine">Rosé Wine</Select.Option>
                            <Select.Option value="Sparkling Wine">Sparkling Wine</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item key="AreaOrder" name="AreaOrder" label="AreaOrder">
                        <Input
                            placeholder="Vineyard areaOrder"
                            value={AreaOrder}
                            onChange={(event) => setAreaOrder(event.target.value)}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="area" name="area" label="SelectNewArea">
                        <Select
                            defaultActiveFirstOption
                            value={area}
                            onChange={(value) => setArea(value)}
                        >
                            {areas.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item key="yearOfPlaning" name="yearOfPlaning" label="yearOfPlaning">
                        <Input
                            placeholder="Vineyard yearOfPlaning"
                            value={yearOfPlaning}
                            onChange={(event) => setYearOfPlaning(event.target.value)}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="latitude" name="latitude" label="latitude">
                        <Input
                            placeholder="Vineyard latitude"
                            value={latitude}
                            onChange={(event) => setLatitude(event.target.value)}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="longitude" name="longitude" label="longitude">
                        <Input
                            placeholder="Vineyard longitude"
                            value={longitude}
                            onChange={(event) => setLongitude(event.target.value)}
                        />{' '}
                    </Form.Item>
                    <Form.Item
                        name="Select Vineyard"
                        label="submit the info"
                        rules={[
                            {
                                required: true,
                                message: 'Select something!',
                            },
                        ]}
                    >
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Form.Item>
                </Form>
            ) : (
                <Form {...formItemLayout} name="vineyard infomation" scrollToFirstError>
                    <Form.Item key="vineyardName" name="vineyardName" label="vineyardName">
                        <Input
                            placeholder="Vineyard areaOrder"
                            value={editState ? '' : data.vineyardName}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="typeOfWine" name="typeOfWine" label="typeOfWine">
                        <Input
                            placeholder="Vineyard areaOrder"
                            value={editState ? '' : data.typeOfWine}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="AreaOrder" name="AreaOrder" label="AreaOrder">
                        <Input
                            placeholder="Vineyard areaOrder"
                            value={editState ? '' : data.AreaOrder}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="area" name="area" label="Select Area">
                        <Select defaultActiveFirstOption>
                            {areas.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item key="yearOfPlaning" name="yearOfPlaning" label="yearOfPlaning">
                        <Input
                            placeholder="Vineyard yearOfPlaning"
                            value={editState ? '' : data.yearOfPlaning}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="latitude" name="latitude" label="latitude">
                        <Input
                            placeholder="Vineyard latitude"
                            value={editState ? '' : data.latitude}
                        />{' '}
                    </Form.Item>
                    <Form.Item key="longitude" name="longitude" label="longitude">
                        <Input
                            placeholder="Vineyard longitude"
                            value={editState ? '' : data.longitude}
                        />{' '}
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

const VineyardsInfo = () => {
    const [areas, setAreas] = useState();
    const [area, setArea] = useState();
    const [currentVineyard, setCurrentVineyard] = useState();
    const [confirm, setConfirm] = useState(false);
    const [edit, setEdit] = useState(false);
    const handleAreaOption = (value: string) => {
        getAreaByID(value).then((res) => {
            setArea(res);
        });
    };
    const handleVineyardOption = (value: string) => {
        getVineyardByID(value).then((res) => {
            console.log('selected Vineyard', res);
            setCurrentVineyard(res);
            setConfirm(false);
            setEdit(false);
        });
    };
    const handleConfirm = () => {
        setConfirm(true);
    };
    const handleEdit = () => {
        console.log(currentVineyard);
        setEdit(true);
    };
    useEffect(() => {
        getAreas().then((res) => {
            setAreas(res);
        });
    }, []);
    return (
        <>
            <Theme>
                <Header />
                <EditVineyardMap />
                <div
                    id="form"
                    className="tw-w-1/2 tw-left-1/4 tw-invisible tw-bg-violet-200 hover:tw-bg-violet-200/80 tw-absolute tw-top-1/4 tw-py-10 tw-px-2"
                >
                    <Form {...formItemLayout} name="vineyard infomation" scrollToFirstError>
                        {areas === undefined ? (
                            'undefied'
                        ) : (
                            <Form.Item
                                name="Select Area"
                                label="Area"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(value) => handleAreaOption(value)}
                                    defaultActiveFirstOption
                                >
                                    {areas.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {area === undefined ? (
                            ''
                        ) : (
                            <Form.Item
                                name="Select Vineyard"
                                label="Vineyard"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(value) => handleVineyardOption(value)}
                                    defaultActiveFirstOption
                                >
                                    {area.vineyards.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.areanumber}-{item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {!confirm ? (
                            <Form.Item
                                name="Select Vineyard"
                                label="Confirm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Button onClick={handleConfirm}>Confirm</Button>
                            </Form.Item>
                        ) : (
                            ''
                        )}
                        {confirm ? (
                            <GetVineyard editState={edit} data={currentVineyard} areas={areas} />
                        ) : (
                            ''
                        )}
                        {!edit ? (
                            <Form.Item
                                name="Select Vineyard"
                                label="Edit"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Button onClick={handleEdit}>Edit</Button>
                            </Form.Item>
                        ) : (
                            ''
                        )}
                    </Form>
                </div>
            </Theme>
        </>
    );
};
export default VineyardsInfo;
