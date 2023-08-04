import { Button, Card, Divider, Form, Input, Select } from 'antd';

import { useState } from 'react';

import TextArea from 'antd/es/input/TextArea';

import { DeleteFilled, EditFilled, SmileFilled } from '@ant-design/icons';

import { deleteReortByID, updateReport } from '@/server/api/apis';

import ResultContainer from './Result';

interface ReportCardProps {
    id: string;
    title: string;
    description: string;
    disease: string;
    area: Array<any>;
    vineyard: Array<any>;
}
export const ReportCard: React.FC<ReportCardProps> = ({
    id,
    title,
    description,
    disease,
    area,
    vineyard,
}) => {
    const [edit, setEdit] = useState(false);
    const [deleteEdit, setDeleteEdit] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const handleDeleteEdit = () => {
        setDeleteEdit(true);
    };
    const handleDelete = () => {
        deleteReortByID(id)
            .then(() => {
                console.log('deleted:');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error deleting:', error);
            });
    };
    const handleEdit = async (values: any) => {
        setEdit(true);
        const { newtitle, newdisease, newdescription, newstatus } = values;
        try {
            const response = await updateReport(
                id,
                newtitle,
                newdisease,
                newdescription,
                area.id,
                vineyard.id,
                newstatus,
            );
            console.log('Response:', response);
            setEditSuccess(true);
        } catch (error) {
            console.error('Failed to submit area:', error);
        }
    };
    return (
        <>
            <Card
                id="report-card"
                className="tw-bg-violet-300/80 hover:tw-bg-customPurple tw-rounded-tr-3xl tw-rounded-none tw-max-w-xs md:tw-min-w-0 md:tw-flex-grow"
            >
                {!edit && (
                    <>
                        <div
                            id="report-card-title"
                            className="tw-inline-block tw-align-middle tw-font-bold tw-py-2 tw-w-full tw-bg-customPurple tw-text-white tw-rounded-xl tw-text-center tw-text-base"
                        >
                            {title}
                        </div>
                        <Divider />
                        <div className="tw-h-10">Disease: {disease}</div>
                        <div className="tw-h-10">Description: {description}</div>
                        <div className="tw-h-10">Area: {area.name}</div>
                        <div className="tw-h-10">Vineyard: {vineyard.name}</div>
                        <div className=" tw-grid  tw-gap-4 tw-w-full tw-grid-flow-row">
                            <Button
                                id="button"
                                className="tw-align-self-center"
                                onClick={handleDeleteEdit}
                            >
                                <DeleteFilled style={{ color: 'purple' }} rev={undefined} /> delete
                            </Button>

                            <Button
                                id="button"
                                className="tw-align-self-center"
                                onClick={handleEdit}
                            >
                                <EditFilled style={{ color: 'purple' }} rev={undefined} />
                                Edit
                            </Button>
                            {deleteEdit && (
                                <div className=" tw-bg-purple-600 tw-p-4 tw-rounded tw-text-white tw-grid tw-text-center tw-place-text-center">
                                    <p>
                                        <SmileFilled rev={undefined} />
                                        Are you sure you want to delete this report?
                                    </p>
                                    <Button
                                        id="button"
                                        className="tw-align-self-center "
                                        onClick={handleDelete}
                                    >
                                        <DeleteFilled style={{ color: 'purple' }} rev={undefined} />{' '}
                                        Yes I am sure
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {edit && (
                    <>
                        <Form
                            name="report infomation"
                            style={{
                                maxWidth: 600,
                            }}
                            scrollToFirstError
                            onFinish={handleEdit}
                        >
                            <Form.Item
                                key="newtitle"
                                name="newtitle"
                                initialValue={title}
                                label="Report Title"
                            >
                                <Input placeholder="Title" />
                            </Form.Item>
                            <Form.Item
                                key="disease"
                                name="newdisease"
                                label="Select Disease"
                                initialValue={disease}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="Type A">Type A</Select.Option>
                                    <Select.Option value="Type B">Type B</Select.Option>
                                    <Select.Option value="Type C">Type C</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                key="status"
                                name="newstatus"
                                label="Status"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={2}>Update Report</Select.Option>
                                    <Select.Option value={3}>Archive Report</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="newdescription"
                                key="newdescription"
                                label="Description"
                                initialValue={description}
                            >
                                <TextArea rows={1} />
                            </Form.Item>
                            <Form.Item name="Select Vineyard" label="Submit">
                                <Button htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                {editSuccess && <ResultContainer />}
            </Card>
        </>
    );
};
