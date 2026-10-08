
Now lets work on one page after another 
1. start with event monitoring
- i want when this page loads to display/render all the markers for events fetched/loaded on the map since that's what this page is made for
- i want when the markers are hovered they should display little translucent bubble/modal/note with short info about that event and area which are comming/fetched from backend[
title
eventType
city
country
(latitude,longitude)
]
- on the Analytics top section it should show scrollable list those events fetched and on the bottom the chart/graph should remain as it is 
- on Recent Events section it should work on displaying data too




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
                        "color": "#22c55e",
                        "metadata": {},
                        "timestamp": "2026-07-22T11:07:18.000Z"
                    }
                }
            ]
        }
    }
}


    -----------------------------------------------------
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
        "lastUpdate": "2026-10-08T13:41:00.264Z"
    }
}


-----------------------------------------
    Request URL
    http://localhost:5000/api/v1/events?limit=20
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
        "events": [
            {
                "id": 1,
                "eventType": "Cyber Attack",
                "title": "DDoS Attack Detected",
                "description": "Distributed denial of service attack from external source",
                "severity": "Critical",
                "status": "Open",
                "source": "SOC",
                "locationId": null,
                "latitude": "39.9042000",
                "longitude": "116.4074000",
                "country": "China",
                "region": null,
                "city": "Beijing",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 2,
                "eventType": "Network Outage",
                "title": "Router Failure - NYC",
                "description": "Core router offline in New York datacenter",
                "severity": "High",
                "status": "Investigating",
                "source": "NOC",
                "locationId": null,
                "latitude": "40.7128000",
                "longitude": "-74.0060000",
                "country": "United States",
                "region": null,
                "city": "New York",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 3,
                "eventType": "Sensor Alert",
                "title": "Temperature Threshold Exceeded",
                "description": "Industrial sensor reading above safe limit",
                "severity": "Medium",
                "status": "Open",
                "source": "IoT",
                "locationId": null,
                "latitude": "-6.7924000",
                "longitude": "39.2083000",
                "country": "Tanzania",
                "region": null,
                "city": "Dar es Salaam",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 4,
                "eventType": "Traffic Incident",
                "title": "Highway Collision",
                "description": "Multi-vehicle accident on main highway",
                "severity": "High",
                "status": "In Progress",
                "source": "Emergency",
                "locationId": null,
                "latitude": "-1.2921000",
                "longitude": "36.8219000",
                "country": "Kenya",
                "region": null,
                "city": "Nairobi",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 5,
                "eventType": "Fraud",
                "title": "Suspicious Transaction Cluster",
                "description": "Multiple high-value transactions from same region",
                "severity": "High",
                "status": "Open",
                "source": "Fraud Detection",
                "locationId": null,
                "latitude": "51.5074000",
                "longitude": "-0.1278000",
                "country": "United Kingdom",
                "region": null,
                "city": "London",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 6,
                "eventType": "Emergency",
                "title": "Flood Warning",
                "description": "Rising water levels in coastal area",
                "severity": "Critical",
                "status": "Open",
                "source": "Emergency Services",
                "locationId": null,
                "latitude": "-6.8160000",
                "longitude": "39.2803000",
                "country": "Tanzania",
                "region": null,
                "city": "Dar es Salaam",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 7,
                "eventType": "Unauthorized Access",
                "title": "Failed Login Attempts",
                "description": "Brute force attack on admin portal",
                "severity": "Medium",
                "status": "Resolved",
                "source": "SOC",
                "locationId": null,
                "latitude": "55.7558000",
                "longitude": "37.6173000",
                "country": "Russia",
                "region": null,
                "city": "Moscow",
                "startTime": "2026-07-21T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 8,
                "eventType": "Asset Movement",
                "title": "Container Deviation",
                "description": "Shipping container off planned route",
                "severity": "Low",
                "status": "Open",
                "source": "Logistics",
                "locationId": null,
                "latitude": "1.3521000",
                "longitude": "103.8198000",
                "country": "Singapore",
                "region": null,
                "city": "Singapore",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 9,
                "eventType": "Sensor Spike",
                "title": "Temp spike",
                "description": null,
                "severity": "Low",
                "status": "Open",
                "source": "IoT",
                "locationId": null,
                "latitude": "-6.7950000",
                "longitude": "39.2100000",
                "country": "Tanzania",
                "region": null,
                "city": "Dar es Salaam",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 10,
                "eventType": "Sensor Spike",
                "title": "Humidity spike",
                "description": null,
                "severity": "Low",
                "status": "Open",
                "source": "IoT",
                "locationId": null,
                "latitude": "-6.7990000",
                "longitude": "39.2150000",
                "country": "Tanzania",
                "region": null,
                "city": "Dar es Salaam",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            },
            {
                "id": 11,
                "eventType": "Sensor Spike",
                "title": "Vibration",
                "description": null,
                "severity": "Medium",
                "status": "Open",
                "source": "IoT",
                "locationId": null,
                "latitude": "-6.8030000",
                "longitude": "39.2180000",
                "country": "Tanzania",
                "region": null,
                "city": "Dar es Salaam",
                "startTime": "2026-07-22T11:07:18.000Z",
                "endTime": null,
                "metadata": null,
                "createdBy": null,
                "createdAt": "2026-07-22T11:07:18.000Z",
                "updatedAt": "2026-07-22T11:07:18.000Z"
            }
        ],
        "total": 11,
        "page": 1,
        "limit": 20
    }
}

---------------------------------
Request URL
http://localhost:5000/api/v1/analytics/event-types
Request Method
GET
Status Code
304 Not Modified
Remote Address
[::1]:5000
Referrer Policy
strict-origin-when-cross-origin


RESPONSE:
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "eventType": "Asset Movement",
            "count": 1
        },
        {
            "eventType": "Cyber Attack",
            "count": 1
        },
        {
            "eventType": "Emergency",
            "count": 1
        },
        {
            "eventType": "Fraud",
            "count": 1
        },
        {
            "eventType": "Network Outage",
            "count": 1
        },
        {
            "eventType": "Sensor Alert",
            "count": 1
        },
        {
            "eventType": "Sensor Spike",
            "count": 3
        },
        {
            "eventType": "Traffic Incident",
            "count": 1
        },
        {
            "eventType": "Unauthorized Access",
            "count": 1
        }
    ]
}

]