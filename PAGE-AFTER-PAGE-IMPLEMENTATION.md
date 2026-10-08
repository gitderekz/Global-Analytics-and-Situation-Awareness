Now lets continue with another page 
2. Asset Tracking

- when the page loads among the requests and responses are:
[
    Request URL
http://localhost:5000/api/v1/analytics/map-data
Request Method
GET
Status Code
304 Not Modified
Remote Address
[::1]:5000
Referrer Policy
strict-origin-when-cross-origin

    ITS RESPONSE:
{
    "success": true,
    "message": "Success",
    "data": {
        "events": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            116.4074,
                            39.9042
                        ]
                    },
                    "properties": {
                        "id": 1,
                        "type": "event",
                        "name": "DDoS Attack Detected",
                        "status": "Open",
                        "severity": "Critical",
                        "eventType": "Cyber Attack",
                        "city": "Beijing",
                        "country": "China",
                        "latitude": 39.9042,
                        "longitude": 116.4074,
                        "color": "#ef4444",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -74.006,
                            40.7128
                        ]
                    },
                    "properties": {
                        "id": 2,
                        "type": "event",
                        "name": "Router Failure - NYC",
                        "status": "Investigating",
                        "severity": "High",
                        "eventType": "Network Outage",
                        "city": "New York",
                        "country": "United States",
                        "latitude": 40.7128,
                        "longitude": -74.006,
                        "color": "#f97316",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2083,
                            -6.7924
                        ]
                    },
                    "properties": {
                        "id": 3,
                        "type": "event",
                        "name": "Temperature Threshold Exceeded",
                        "status": "Open",
                        "severity": "Medium",
                        "eventType": "Sensor Alert",
                        "city": "Dar es Salaam",
                        "country": "Tanzania",
                        "latitude": -6.7924,
                        "longitude": 39.2083,
                        "color": "#eab308",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            36.8219,
                            -1.2921
                        ]
                    },
                    "properties": {
                        "id": 4,
                        "type": "event",
                        "name": "Highway Collision",
                        "status": "In Progress",
                        "severity": "High",
                        "eventType": "Traffic Incident",
                        "city": "Nairobi",
                        "country": "Kenya",
                        "latitude": -1.2921,
                        "longitude": 36.8219,
                        "color": "#f97316",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -0.1278,
                            51.5074
                        ]
                    },
                    "properties": {
                        "id": 5,
                        "type": "event",
                        "name": "Suspicious Transaction Cluster",
                        "status": "Open",
                        "severity": "High",
                        "eventType": "Fraud",
                        "city": "London",
                        "country": "United Kingdom",
                        "latitude": 51.5074,
                        "longitude": -0.1278,
                        "color": "#f97316",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2803,
                            -6.816
                        ]
                    },
                    "properties": {
                        "id": 6,
                        "type": "event",
                        "name": "Flood Warning",
                        "status": "Open",
                        "severity": "Critical",
                        "eventType": "Emergency",
                        "city": "Dar es Salaam",
                        "country": "Tanzania",
                        "latitude": -6.816,
                        "longitude": 39.2803,
                        "color": "#ef4444",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            37.6173,
                            55.7558
                        ]
                    },
                    "properties": {
                        "id": 7,
                        "type": "event",
                        "name": "Failed Login Attempts",
                        "status": "Resolved",
                        "severity": "Medium",
                        "eventType": "Unauthorized Access",
                        "city": "Moscow",
                        "country": "Russia",
                        "latitude": 55.7558,
                        "longitude": 37.6173,
                        "color": "#eab308",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            103.8198,
                            1.3521
                        ]
                    },
                    "properties": {
                        "id": 8,
                        "type": "event",
                        "name": "Container Deviation",
                        "status": "Open",
                        "severity": "Low",
                        "eventType": "Asset Movement",
                        "city": "Singapore",
                        "country": "Singapore",
                        "latitude": 1.3521,
                        "longitude": 103.8198,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.21,
                            -6.795
                        ]
                    },
                    "properties": {
                        "id": 9,
                        "type": "event",
                        "name": "Temp spike",
                        "status": "Open",
                        "severity": "Low",
                        "eventType": "Sensor Spike",
                        "city": "Dar es Salaam",
                        "country": "Tanzania",
                        "latitude": -6.795,
                        "longitude": 39.21,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.215,
                            -6.799
                        ]
                    },
                    "properties": {
                        "id": 10,
                        "type": "event",
                        "name": "Humidity spike",
                        "status": "Open",
                        "severity": "Low",
                        "eventType": "Sensor Spike",
                        "city": "Dar es Salaam",
                        "country": "Tanzania",
                        "latitude": -6.799,
                        "longitude": 39.215,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.218,
                            -6.803
                        ]
                    },
                    "properties": {
                        "id": 11,
                        "type": "event",
                        "name": "Vibration",
                        "status": "Open",
                        "severity": "Medium",
                        "eventType": "Sensor Spike",
                        "city": "Dar es Salaam",
                        "country": "Tanzania",
                        "latitude": -6.803,
                        "longitude": 39.218,
                        "color": "#eab308",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                }
            ]
        },
        "assets": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2083,
                            -6.7924
                        ]
                    },
                    "properties": {
                        "id": 1,
                        "type": "asset",
                        "name": "Fleet Truck Alpha",
                        "status": "active",
                        "assetType": "Vehicle",
                        "city": "",
                        "country": "",
                        "latitude": -6.7924,
                        "longitude": 39.2083,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            35,
                            -1.5
                        ]
                    },
                    "properties": {
                        "id": 2,
                        "type": "asset",
                        "name": "Cargo Flight TZ-401",
                        "status": "active",
                        "assetType": "Aircraft",
                        "city": "",
                        "country": "",
                        "latitude": -1.5,
                        "longitude": 35,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            40,
                            -5
                        ]
                    },
                    "properties": {
                        "id": 3,
                        "type": "asset",
                        "name": "MV Indian Ocean",
                        "status": "active",
                        "assetType": "Ship",
                        "city": "",
                        "country": "",
                        "latitude": -5,
                        "longitude": 40,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2295,
                            -6.7735
                        ]
                    },
                    "properties": {
                        "id": 4,
                        "type": "asset",
                        "name": "Survey Drone D-07",
                        "status": "active",
                        "assetType": "Drone",
                        "city": "",
                        "country": "",
                        "latitude": -6.7735,
                        "longitude": 39.2295,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            103.8198,
                            1.3521
                        ]
                    },
                    "properties": {
                        "id": 5,
                        "type": "asset",
                        "name": "CNT-88421",
                        "status": "active",
                        "assetType": "Container",
                        "city": "",
                        "country": "",
                        "latitude": 1.3521,
                        "longitude": 103.8198,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            36.8219,
                            -1.2921
                        ]
                    },
                    "properties": {
                        "id": 6,
                        "type": "asset",
                        "name": "Emergency Response Unit",
                        "status": "active",
                        "assetType": "Vehicle",
                        "city": "",
                        "country": "",
                        "latitude": -1.2921,
                        "longitude": 36.8219,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.1814929,
                            -6.6596299
                        ]
                    },
                    "properties": {
                        "id": 7,
                        "type": "asset",
                        "name": "ATM Akiba Commercial Bank, Tegeta Kibo",
                        "status": "active",
                        "assetType": "Machine",
                        "city": "",
                        "country": "",
                        "latitude": -6.6596299,
                        "longitude": 39.1814929,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-10-08T10:28:59.000Z"
                    }
                }
            ]
        },
        "devices": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2083,
                            -6.7924
                        ]
                    },
                    "properties": {
                        "id": 1,
                        "type": "device",
                        "name": "Temp Sensor Warehouse A",
                        "status": "online",
                        "deviceType": "Sensor",
                        "city": "",
                        "country": "",
                        "latitude": -6.7924,
                        "longitude": 39.2083,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            39.2803,
                            -6.816
                        ]
                    },
                    "properties": {
                        "id": 2,
                        "type": "device",
                        "name": "Security Camera Gate 3",
                        "status": "online",
                        "deviceType": "Camera",
                        "city": "",
                        "country": "",
                        "latitude": -6.816,
                        "longitude": 39.2803,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -74.006,
                            40.7128
                        ]
                    },
                    "properties": {
                        "id": 3,
                        "type": "device",
                        "name": "IoT Gateway Main",
                        "status": "online",
                        "deviceType": "Gateway",
                        "city": "",
                        "country": "",
                        "latitude": 40.7128,
                        "longitude": -74.006,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -74.006,
                            40.7128
                        ]
                    },
                    "properties": {
                        "id": 4,
                        "type": "device",
                        "name": "Core Router NYC",
                        "status": "offline",
                        "deviceType": "Router",
                        "city": "",
                        "country": "",
                        "latitude": 40.7128,
                        "longitude": -74.006,
                        "color": "#6b7280",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            36.8219,
                            -1.2921
                        ]
                    },
                    "properties": {
                        "id": 5,
                        "type": "device",
                        "name": "GPS Tracker Unit 330",
                        "status": "online",
                        "deviceType": "Tracker",
                        "city": "",
                        "country": "",
                        "latitude": -1.2921,
                        "longitude": 36.8219,
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                }
            ]
        }
    }
}

----------------------------------------------------
Request URL
http://localhost:5000/api/v1/analytics/kpis
Request Method
GET
Status Code
200 OK
Remote Address
[::1]:5000
Referrer Policy
strict-origin-when-cross-origin


    ITS RESPONSE:
{
    "success": true,
    "message": "Success",
    "data": {
        "totalEvents": 11,
        "eventsToday": 0,
        "activeAssets": 7,
        "connectedDevices": 4,
        "criticalAlerts": 2,
        "openAlerts": 3,
        "threatCount": 1,
        "countriesActive": 7,
        "networkStatus": "healthy",
        "lastUpdate": "2026-10-08T15:57:41.041Z"
    }
}

----------------------------------------------------
Request URL
http://localhost:5000/api/v1/assets?limit=20
Request Method
GET
Status Code
304 Not Modified
Remote Address
[::1]:5000
Referrer Policy
strict-origin-when-cross-origin


    ITS RESPONSE:
{
    "success": true,
    "message": "Success",
    "data": {
        "assets": [
            {
                "id": 7,
                "assetType": "Machine",
                "name": "ATM Akiba Commercial Bank, Tegeta Kibo",
                "description": "Mashine ya ATM Akiba Commercial Bank iliyopo Tegeta Kibo",
                "status": "active",
                "locationId": null,
                "latitude": "-6.6596299",
                "longitude": "39.1814929",
                "speed": "1.00",
                "heading": "1.00",
                "altitude": "10.00",
                "metadata": null,
                "createdAt": "2026-10-08T10:28:59.000Z",
                "updatedAt": "2026-10-08T10:28:59.000Z"
            },
            {
                "id": 1,
                "assetType": "Vehicle",
                "name": "Fleet Truck Alpha",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "-6.7924000",
                "longitude": "39.2083000",
                "speed": "45.50",
                "heading": "180.00",
                "altitude": null,
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 2,
                "assetType": "Aircraft",
                "name": "Cargo Flight TZ-401",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "-1.5000000",
                "longitude": "35.0000000",
                "speed": "850.00",
                "heading": "45.00",
                "altitude": "10000.00",
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 3,
                "assetType": "Ship",
                "name": "MV Indian Ocean",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "-5.0000000",
                "longitude": "40.0000000",
                "speed": "18.00",
                "heading": "270.00",
                "altitude": null,
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 4,
                "assetType": "Drone",
                "name": "Survey Drone D-07",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "-6.7735000",
                "longitude": "39.2295000",
                "speed": "25.00",
                "heading": "90.00",
                "altitude": null,
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 5,
                "assetType": "Container",
                "name": "CNT-88421",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "1.3521000",
                "longitude": "103.8198000",
                "speed": "0.00",
                "heading": "0.00",
                "altitude": null,
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 6,
                "assetType": "Vehicle",
                "name": "Emergency Response Unit",
                "description": null,
                "status": "active",
                "locationId": null,
                "latitude": "-1.2921000",
                "longitude": "36.8219000",
                "speed": "60.00",
                "heading": "315.00",
                "altitude": null,
                "metadata": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            }
        ],
        "total": 7
    }
}

]