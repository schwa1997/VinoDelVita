import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button, Form, Input } from 'antd';

import { useFormik } from 'formik';

import { createArea } from '@/server/api/apis';

import ResultContainer from '../pages/components/Result';

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
            span: 16,
        },
    },
};
const NewAreaForm = ({ geometry }) => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState(null); // State to handle submission errors
    const [visible, setVisible] = useState(true);
    const handleClose = () => {
        setVisible(false);
    };
    const formik = useFormik({
        initialValues: {
            name: '',
            code: '',
            geometry,
        },
        onSubmit: async (values) => {
            // Add 'async' here
            const { name, code } = values;
            const geoJsonPolygon = {
                type: 'Polygon',
                coordinates: [geometry],
            };
            const data = {
                name,
                code,
                geometry: geoJsonPolygon,
            };
            if (!values.name || !values.code) {
                console.error('Missing required fields in data:', values);
                return;
            }

            try {
                const response = await createArea(name, code, data.geometry);
                console.log('Response:', response);
                setSubmitSuccess(true);
            } catch (error) {
                setSubmissionError(error.message);
                console.error('Failed to submit area:', error);
            }
        },
    });

    return (
        <>
            {!submitSuccess && visible && (
                <>
                    <form
                        id="Container"
                        className="tw-z-50 tw-fixed md:tw-right-8 tw-top-1/4 tw-right-1/4 tw-transform  tw-bg-gradient-to-b tw-from-violet-300 tw-via-purple-300 tw-to-violet-50 tw-rounded-lg tw-shadow-md tw-p-6 sm:tw-p-8"
                        onSubmit={formik.handleSubmit}
                    >
                        {submissionError && (
                            <p className="tw-text-red-600 tw-mb-4">{submissionError}</p>
                        )}
                        <button
                            className="tw-absolute tw-top-2 tw-right-2 tw-text-black tw-rounded-full tw-outline-none tw-shadow-md"
                            onClick={handleClose}
                        >
                            X
                        </button>

                        <div className="tw-mb-4">
                            <label htmlFor="name" className="tw-block tw-font-bold">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                        <div className="tw-mb-4">
                            <label htmlFor="email" className="tw-block tw-font-bold">
                                Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="code"
                                onChange={formik.handleChange}
                                value={formik.values.code}
                                className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
                            />
                        </div>
                        <button
                            id="button"
                            type="submit"
                            className="tw-bg-customPurple tw-hover:bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-w-full sm:tw-w-auto"
                        >
                            Submit
                        </button>
                    </form>
                </>
            )}
            {submitSuccess && <ResultContainer />}
        </>
    );
};

const AreaMap: React.FC = () => {
    const [geometry, setGeometry] = useState<any>([]);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const toggleFormVisibility = () => {
        setIsFormVisible((prevValue) => !prevValue);
    };
    const handleDeleteCoordinate = (index) => {
        // Create a new array with the selected coordinate pair removed
        const newGeometry = geometry.filter((_, i) => i !== index);
        // Update the state with the new array
        setGeometry(newGeometry);
    };
    useEffect(() => {
        let map: L.Map | null = null;
        let areaPolygon: L.Polygon | null = null;

        if (!map) {
            map = L.map('map');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        map?.setView([latitude, longitude], 19);

                        areaPolygon = L.polygon(geometry, {
                            color: 'purple',
                            weight: 3,
                            fillColor: 'pink',
                            fillOpacity: 0.4,
                        }).addTo(map!);
                        areaPolygon.bindPopup('New Area').openPopup();
                    },
                    (error) => {
                        console.error('Error getting current position:', error);
                    },
                );
            }

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Add click event listener to the map
            map.on('click', (event: L.LeafletMouseEvent) => {
                const { lat, lng } = event.latlng;
                setGeometry((prevGeometry: any) => [...prevGeometry, [lat, lng]]);
            });
        }

        return () => {
            if (map) {
                map.remove();
                map = null;
            }
            if (areaPolygon) {
                areaPolygon.remove();
                areaPolygon = null;
            }
        };
    }, [geometry]);

    return (
        <>
            <Button
                id="button"
                className="tw-z-50 tw-fixed tw-bottom-0 tw-left-2 tw-bg-customPurple/60 tw-text-purple-500 tw-rounded-md tw-px-4 tw-pb-2 tw-m-2 hover:tw-bg-customPurple"
                onClick={toggleFormVisibility}
            >
                {isFormVisible ? 'Hide Geometry Form' : 'Show Geometry Form'}
            </Button>
            <div id="map" className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0" />
            <NewAreaForm geometry={geometry} />
            {isFormVisible && (
                <div
                    id="form"
                    className="tw-container tw-rounded-xl tw-w-1/3 tw-bg-customPurple/70 hover:tw-bg-customPurple tw-absolute tw-text-white tw-top-44 md:tw-top-32 tw-left-4 tw-pt-10 tw-pl-2 tw-pr-6"
                >
                    <Form {...formItemLayout}>
                        {geometry &&
                            geometry.map((coordinatePair, index) => (
                                <div key={index}>
                                    <Form.Item label={`Latitude ${index + 1}`}>
                                        <Input
                                            value={coordinatePair[0]}
                                            onChange={(e) =>
                                                handleCoordinateChange(
                                                    index,
                                                    0,
                                                    parseFloat(e.target.value) || 0,
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label={`Longitude ${index + 1}`}>
                                        <Input
                                            value={coordinatePair[1]}
                                            onChange={(e) =>
                                                handleCoordinateChange(
                                                    index,
                                                    1,
                                                    parseFloat(e.target.value) || 0,
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        key="deleteButton"
                                        name="deleteButton"
                                        label="Delete"
                                    >
                                        <Button
                                            id="button"
                                            onClick={() => handleDeleteCoordinate(index)}
                                        >
                                            Delete This Point
                                        </Button>
                                    </Form.Item>
                                </div>
                            ))}
                    </Form>
                </div>
            )}
        </>
    );
};

export default AreaMap;
