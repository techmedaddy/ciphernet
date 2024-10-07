# CipherNet

## Project Description
CipherNet is a modern, secure, and user-friendly VPN service built using Node.js and Express. It allows users to connect to various VPN servers worldwide, ensuring encrypted communication and privacy protection. CipherNet also includes file-sharing capabilities, enabling secure transfer of PDFs, images, videos, and other file types over encrypted connections.

Designed with professionals and businesses in mind, CipherNet provides fast and secure internet connections with an intuitive HTML/CSS user interface, making VPN management accessible without compromising security.

## Key Features
1. **User Authentication**: 
   - Secure login with encrypted passwords using JWT (JSON Web Tokens) for session management.

2. **VPN Connection Management**:
   - Users can easily connect and disconnect from VPN servers.
   - Real-time display of connection status, server location, and data usage.

3. **Server Location Selection**:
   - Users can choose VPN servers from various global locations (e.g., US, UK, Europe).

4. **File Sharing**:
   - Secure upload and download of files (PDFs, images, videos) with encryption.

5. **Connection Metrics**:
   - Detailed information on connected server IP, data usage, connection time, and encryption strength.

6. **Data Encryption**:
   - VPN traffic is encrypted using industry-standard protocols like OpenVPN and L2TP/IPsec to ensure data security.

## Project Structure

```bash
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

