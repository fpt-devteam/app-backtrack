1. POST /api/qr/qr-codes
{
    "item": {
        "name": "Giày sneaker siêu xịn, siêu đẹp",
        "description": "Giày nike, màu trắng, hơi bẩn ở gót",
        "imageUrls": [
            "https://supersports.com.vn/cdn/shop/files/CW2288-111-1.jpg?v=1760951049"
        ]
    }
}
-> create new qr code (digital qr), that includes item information
Response:
{
    "success": true,
    "data": {
        "qrCode": {
            "id": "695fe9458a63f5e66b6ae45b",
            "publicCode": "BTK-8ZO2ERDC",
            "linkedAt": "2026-01-08T17:28:37.437Z",
            "createdAt": "2026-01-08T17:28:37.443Z"
        },
        "item": {
            "name": "Giày sneaker siêu xịn, siêu đẹp",
            "description": "Giày nike, màu trắng, hơi bẩn ở gót",
            "imageUrls": [
                "https://supersports.com.vn/cdn/shop/files/CW2288-111-1.jpg?v=1760951049"
            ]
        },
        "ownerId": "5UOM7YtiyVh5lRGVmPttmrKxTCR2"
    }
}

2. GET /api/qr/qr-codes/:id 
-> get item information linked to the qr code id
Responsee:
{
    "success": true,
    "data": {
        "qrCode": {
            "id": "695fe9458a63f5e66b6ae45b",
            "publicCode": "BTK-8ZO2ERDC",
            "linkedAt": "2026-01-08T17:28:37.437Z",
            "createdAt": "2026-01-08T17:28:37.443Z"
        },
        "item": {
            "name": "Giày sneaker siêu xịn, siêu đẹp",
            "description": "Giày nike, màu trắng, hơi bẩn ở gót",
            "imageUrls": [
                "https://supersports.com.vn/cdn/shop/files/CW2288-111-1.jpg?v=1760951049"
            ]
        },
        "owner": {
            "id": "5UOM7YtiyVh5lRGVmPttmrKxTCR2",
            "email": "nhatthang270404@gmail.com",
            "displayName": "Nhật Thắng"
        }
    }
}

3. GET /api/qr/qr-codes
-> get all qr codes created by the authenticated user
Response: 
{
    "success": true,
    "data": {
        "items": [
            {
                "qrCode": {
                    "id": "695fe9458a63f5e66b6ae45b",
                    "publicCode": "BTK-8ZO2ERDC",
                    "linkedAt": "2026-01-08T17:28:37.437Z",
                    "createdAt": "2026-01-08T17:28:37.443Z"
                },
                "item": {
                    "name": "Giày sneaker siêu xịn, siêu đẹp",
                    "description": "Giày nike, màu trắng, hơi bẩn ở gót",
                    "imageUrls": [
                        "https://supersports.com.vn/cdn/shop/files/CW2288-111-1.jpg?v=1760951049"
                    ]
                },
                "ownerId": "5UOM7YtiyVh5lRGVmPttmrKxTCR2"
            },
            {
                "qrCode": {
                    "id": "69568776c12c4fdf3490e76d",
                    "publicCode": "BTK-PBIYXDYD",
                    "linkedAt": "2026-01-01T14:40:54.162Z",
                    "createdAt": "2026-01-01T14:40:54.169Z"
                },
                "item": {
                    "name": "Giày sneaker siêu xịn, siêu đẹp",
                    "description": "Giày nike, màu trắng, hơi bẩn ở gót",
                    "imageUrls": [
                        "https://supersports.com.vn/cdn/shop/files/CW2288-111-1.jpg?v=1760951049"
                    ]
                },
                "ownerId": "5UOM7YtiyVh5lRGVmPttmrKxTCR2"
            }
        ],
        "page": 1,
        "pageSize": 20,
        "totalCount": 2,
        "totalPages": 1
    }
}
-> must implement pagination with query params: page, pageSize, but using infinite scroll on the client side