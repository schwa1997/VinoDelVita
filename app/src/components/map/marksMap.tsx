import React, { useEffect } from 'react';
import L from 'leaflet';

interface MarksAreaProps {
    area: any;
}

const MarksArea: React.FC<MarksAreaProps> = ({ area }) => {
    useEffect(() => {
        let map: L.Map | null = null;
        let markers: L.Marker[] = [];
        let areaPolygon: L.Polygon | null = null;
        let vineyardMarkers: L.Marker[] = [];
        let vineyardPolygon: L.Polygon | null = null;

        if (!map) {
            map = L.map('map').setView(
                [area.geometry.coordinates[0][0][1], area.geometry.coordinates[0][0][0]],
                19,
            );

            const customIcon = L.divIcon({
                className: 'custom-icon',
                html: '📍',
                iconSize: [40, 40],
            });
            const vineyardIcon = L.divIcon({
                className: 'custom-icon',
                html: '🍇',
                iconSize: [40, 40],
            });

            // Create markers for each coordinate in the 'area' object and add them to the map
            markers = area.geometry.coordinates[0].map((coordinate: number[]) => {
                const latLng = L.latLng(coordinate[1], coordinate[0]); // GeoJSON uses [longitude, latitude] format
                const marker = L.marker(latLng, { icon: customIcon }).addTo(map!);
                return marker;
            });

            areaPolygon = L.polygon(area.geometry.coordinates[0], {
                color: 'purple',
                weight: 3,
                fillColor: 'pink',
                fillOpacity: 0.4,
            }).addTo(map!);
            areaPolygon.bindPopup(`Area name:${area.name}`).openPopup();

            // Loop through each vineyard and create markers and a polygon for each
            area.vineyards.forEach((vineyard: any) => {
                vineyardMarkers = vineyard.geometry.coordinates[0].map((coordinate: number[]) => {
                    const latLng = L.latLng(coordinate[1], coordinate[0]);
                    const marker = L.marker(latLng, { icon: vineyardIcon }).addTo(map!);
                    return marker;
                });

                vineyardPolygon = L.polygon(vineyard.geometry.coordinates[0], {
                    color: 'purple',
                    weight: 3,
                    fillColor: 'red',
                    fillOpacity: 0.4,
                }).addTo(map!);
                // vineyardPolygon.bindPopup(vineyard.name).openPopup();
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);
        }

        return () => {
            if (map) {
                map.remove();
                map = null;
            }
            markers.forEach((marker) => {
                marker.remove();
            });
            markers = [];
            vineyardMarkers.forEach((marker) => {
                marker.remove();
            });
            vineyardMarkers = [];
            if (areaPolygon) {
                areaPolygon.remove();
                areaPolygon = null;
            }
            if (vineyardPolygon) {
                vineyardPolygon.remove();
                vineyardPolygon = null;
            }
        };
    }, [area]);

    return (
        <>
            <div id="map" className="tw-fixed tw-h-screen tw-w-screen tw-z-0 tw-top-28 tw-left-0" />
        </>
    );
};

export default MarksArea;
