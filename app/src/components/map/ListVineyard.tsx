import { Form, Select } from 'antd';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';

import { getAllVineyardsByUserID } from '@/server/api/apis';

const ListVineyards: React.FC = () => {
    const [vineyards, setVineyards] = useState([]);
    const [allvineyards, setAllVineyards] = useState([]);
    const [selectedVineyard, setSelectedVineyard] = useState(null);
    const [vineyardPolygons, setVineyardPolygons] = useState<L.Polygon[]>([]);
    const [disease, setDisease] = useState('');
    const [status, setStatus] = useState('');
    const [selection, setSelection] = useState(0);
    const handleSelectionChange = (value: string) => {
        setSelection(value);
    };
    const handleDiseaseChange = (value: string) => {
        setDisease(value);
        const filteredVineyards = allvineyards.filter((vineyard) =>
            vineyard.reports.some((report) => report.disease === value),
        );
        setVineyards(filteredVineyards);
    };
    const handleStatusChange = (value: any) => {
        console.log(value);
        setStatus(value);
        const filteredVineyards = allvineyards.filter((vineyard) =>
            vineyard.reports.some((report) => report.status === value),
        );
        console.log(filteredVineyards);
        setVineyards(filteredVineyards);
    };
    useEffect(() => {
        getAllVineyardsByUserID().then((res) => {
            setAllVineyards(res);
        });
    }, []);

    const handleVineyardChange = (value: string) => {
        const selectedVineyard = allvineyards.find((item) => item.id === value);
        setSelectedVineyard(selectedVineyard);
        setVineyards(allvineyards);
    };

    useEffect(() => {
        let map: L.Map | null = null;
        if (vineyards.length > 0) {
            if (!map) {
                const coordinates =
                    selectedVineyard?.geometry.coordinates[0][0] ||
                    vineyards[0].geometry.coordinates[0][0];
                map = L.map('map').setView([coordinates[0], coordinates[1]], 19);

                const polygons: L.Polygon[] = vineyards.map((vineyard) =>
                    L.polygon(vineyard.geometry.coordinates[0], {
                        color: 'purple',
                        weight: 3,
                        fillColor: 'pink',
                        fillOpacity: 0.4,
                    }).addTo(map!),
                );

                setVineyardPolygons(polygons);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                    maxZoom: 16,
                }).addTo(map);
            }
        }
        return () => {
            if (map) {
                map.remove();
                map = null;
            }
            vineyardPolygons.forEach((polygon) => {
                polygon.remove();
            });
        };
    }, [vineyards, selectedVineyard, selection]);

    return (
        <>
            <div id="map" className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0" />
            <div className="tw-flex tw-flex-col tw-fixed md:tw-top-32 tw-top-44 tw-left-4 tw-gap-6">
                {vineyards && (
                    <>
                        <Form
                            id="form"
                            className="tw-flex-auto tw-bg-violet-300/70 hover:tw-bg-violet-300 tw-p-4 tw-rounded-md tw-shadow-md"
                        >
                            <p className="tw-bg-violet-300 tw-w-full tw-text-center tw-rounded">
                                <strong>Select Based on Status </strong>
                            </p>
                            <Form.Item
                                name="Selection"
                                label="Select Selection"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select something!',
                                    },
                                ]}
                            >
                                <Select onChange={(value) => handleSelectionChange(value)}>
                                    <Select.Option value={1}>Select From All</Select.Option>
                                    <Select.Option value={2}>Select Based on Status</Select.Option>
                                    <Select.Option value={3}>
                                        Select Based on Disease Type
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                        {selection === 1 && (
                            <Form
                                id="form"
                                className="tw-flex-auto tw-bg-violet-300/70 hover:tw-bg-violet-300 tw-p-4 tw-rounded-md tw-shadow-md"
                            >
                                <p className="tw-bg-violet-300 tw-w-full tw-text-center tw-rounded">
                                    <strong>Select From All </strong>
                                </p>
                                <Form.Item
                                    name="selectVineyard"
                                    label="Select Vineyard"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(value) => handleVineyardChange(value)}
                                        value={selectedVineyard?.id || undefined}
                                        placeholder="Select a vineyard"
                                    >
                                        {allvineyards &&
                                            allvineyards.map((item) => (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                </Form.Item>

                                {selectedVineyard && (
                                    <div>
                                        <p>
                                            <strong>Wine Type:</strong> {selectedVineyard.winetype}
                                        </p>
                                        <p>
                                            <strong>Year of Planning:</strong>{' '}
                                            {selectedVineyard.yearofplanning}
                                        </p>
                                        <p>
                                            <strong>Area Number:</strong>{' '}
                                            {selectedVineyard.areanumber}
                                        </p>
                                    </div>
                                )}
                            </Form>
                        )}
                        {selection === 2 && (
                            <Form
                                id="form"
                                className="tw-flex-auto tw-bg-violet-300/70 hover:tw-bg-violet-300 tw-p-4 tw-rounded-md tw-shadow-md"
                            >
                                <p className="tw-bg-violet-300 tw-w-full tw-text-center tw-rounded">
                                    <strong>Select Based on Status </strong>
                                </p>
                                <Form.Item
                                    name="Status"
                                    label="Select Status"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select onChange={(value) => handleStatusChange(value)}>
                                        <Select.Option value={1}>Reported</Select.Option>
                                        <Select.Option value={2}>On process</Select.Option>
                                        <Select.Option value={3}>Done</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="selectVineyard"
                                    label={`Select Vineyard with ${disease}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(value) => handleVineyardChange(value)}
                                        value={selectedVineyard?.id || undefined}
                                        placeholder="Select a vineyard"
                                    >
                                        {vineyards
                                            ? vineyards.map((item) => (
                                                  <Select.Option key={item.id} value={item.id}>
                                                      {item.name}
                                                  </Select.Option>
                                              ))
                                            : allvineyards.map((item) => (
                                                  <Select.Option key={item.id} value={item.id}>
                                                      {item.name}
                                                  </Select.Option>
                                              ))}
                                    </Select>
                                </Form.Item>
                                {selectedVineyard && (
                                    <div>
                                        <p>
                                            <strong>Intervention:</strong>{' '}
                                            {selectedVineyard.interventions
                                                .map((item) => item.type)
                                                .join(', ')}
                                        </p>
                                        {status && (
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {selectedVineyard.reports
                                                    .map((item) => item.status)
                                                    .join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </Form>
                        )}
                        {selection === 3 && (
                            <Form
                                id="form"
                                className="tw-flex-auto tw-bg-violet-300/70 hover:tw-bg-violet-300 tw-p-4 tw-rounded-md tw-shadow-md"
                            >
                                <p className="tw-bg-violet-300 tw-w-full tw-text-center tw-rounded">
                                    <strong>Select Based on Disease Type </strong>
                                </p>
                                <Form.Item
                                    name="DiseaseType"
                                    label="Select Disease Type"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select onChange={(value) => handleDiseaseChange(value)}>
                                        <Select.Option value="Type A">Type A</Select.Option>
                                        <Select.Option value="Type B">Type B</Select.Option>
                                        <Select.Option value="Type C">Type C</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="selectVineyard"
                                    label={`Select Vineyard with ${disease}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select something!',
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(value) => handleVineyardChange(value)}
                                        value={selectedVineyard?.id || undefined}
                                        placeholder="Select a vineyard"
                                    >
                                        {vineyards
                                            ? vineyards.map((item) => (
                                                  <Select.Option key={item.id} value={item.id}>
                                                      {item.name}
                                                  </Select.Option>
                                              ))
                                            : allvineyards.map((item) => (
                                                  <Select.Option key={item.id} value={item.id}>
                                                      {item.name}
                                                  </Select.Option>
                                              ))}
                                    </Select>
                                </Form.Item>
                                {selectedVineyard && (
                                    <div>
                                        <p>
                                            <strong>Disease Types & Updated Time </strong>From
                                            <strong> All </strong>
                                            Reports
                                        </p>

                                        {selectedVineyard.reports.map((item) => (
                                            <p key={item.id}>
                                                {item.disease} : {item.updatedAt}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </Form>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ListVineyards;
