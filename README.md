# CipherNet

CipherNet is a modern, secure, and user-friendly VPN service built using Node.js and Express. It provides fast and secure internet connections, allowing users to connect to various VPN servers worldwide, ensuring encrypted communication and privacy protection.

![WhatsApp Image 2024-10-17 at 21 57 35_2d246f50](https://github.com/user-attachments/assets/d0f54a06-d26c-4461-b2bc-0d7f43ed18f9)

## 🛠️🖥️ System Design 

![image](https://github.com/user-attachments/assets/27115c5e-68a6-47f5-badb-efb9a302e1ea)




## Project Overview

CipherNet is designed to offer a comprehensive VPN solution with the following key features:

- Secure user authentication
- VPN connection management
- Global server location selection
- Encrypted file sharing capabilities
- Detailed connection metrics
- Industry-standard data encryption

The platform features an intuitive and sleek HTML/CSS user interface, making VPN management accessible while maintaining high security standards. CipherNet is ideal for professionals seeking secure internet browsing and data sharing, as well as businesses aiming to safeguard sensitive data transmissions.

## Key Features

1. **User Authentication**
   - Secure login with encrypted passwords
   - JWT (JSON Web Tokens) for session management

2. **VPN Connection Management**
   - Easy connect/disconnect functionality
   - Real-time status monitoring (connection status, server location, data usage)

3. **Server Location Selection**
   - Choose from various VPN servers globally (e.g., US, UK, Europe)

4. **File Sharing**
   - Secure upload and download of files (PDFs, images, videos, etc.)
   - Maintained encryption and privacy during transfer

5. **Connection Metrics**
   - Detailed information including connected server IP, data usage, connection time, and encryption strength

6. **Data Encryption**
   - All VPN traffic encrypted using industry-standard protocols (e.g., OpenVPN, L2TP/IPsec)
  





## Project Structure

```
CipherNet/
├── backend/               # Backend directory for your Node.js application
│   ├── controllers/       # Controllers for handling business logic
│   │   ├── authController.js
│   │   ├── vpnController.js
│   │   ├── fileController.js
│   ├── models/            # Mongoose models for MongoDB
│   │   ├── userModel.js
│   │   ├── connectionLogModel.js
│   ├── routes/            # Route definitions
│   │   ├── authRoutes.js
│   │   ├── vpnRoutes.js
│   │   ├── fileRoutes.js
│   ├── services/          # Service files for business logic
│   │   ├── vpnService.js
│   │   ├── encryptionService.js
│   ├── middleware/        # Middleware functions
│   │   ├── authMiddleware.js
│   │   ├── fileMiddleware.js
│   ├── utils/             # Utility functions
│   │   └── vpnUtils.js
│   ├── config/            # Configuration files
│   │   └── config.js
│   ├── app.js             # Main app file
│   ├── server.js          # Server entry point
│   └── .env               # Environment variables
├── frontend/              # Frontend directory for your client application
│   ├── css/               # Stylesheets
│   │   └── style.css
│   ├── images/            # Images for the frontend
│   ├── js/                # JavaScript files
│   │   └── script.js      # Main JavaScript for the frontend
│   ├── index.html         # Entry point HTML file
│   ├── dashboard.html      # Dashboard HTML file
├── vpn-config/            # VPN configuration files
│   ├── openvpn/
│   │   ├── server.conf
│   │   └── client.ovpn
│   ├── ipsec/
│   │   └── vpn_config.ipsec
├── logs/                  # Log files
│   ├── connection.log
├── Docker/                # Docker configuration
│   ├── Dockerfile
│   ├── docker-compose.yml
├── tests/                 # Test files
│   ├── vpn.test.js
│   ├── auth.test.js
├── package.json           # Main package.json for Node.js dependencies
├── README.md              # Project documentation
└── .gitignore             # Git ignore file

```

## Backend (Node.js/Express)

- **Controllers**: Manage business logic for authentication, VPN connections, and file sharing.
- **Models**: Define data schemas for users and connection logs.
- **Routes**: Handle HTTP requests for auth, VPN, and file operations.
- **Services**: Implement core VPN connection and encryption logic.
- **Middleware**: Protect routes and validate file uploads.
- **Utils**: Provide helper functions for VPN operations.
- **Config**: Store application configuration and environment variables.

## Frontend (HTML/CSS)

- Clean and responsive user interface for login and dashboard.
- Real-time display of VPN status and metrics.

## VPN Configurations

- Includes setup for OpenVPN and IPsec protocols.

## Docker Support

- Dockerfile and docker-compose.yml for easy deployment and scaling.

## Testing

- Unit tests for VPN functionality and authentication.

