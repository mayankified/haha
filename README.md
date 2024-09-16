Here's a README file in Markdown format for your React Native project with detailed setup instructions:

```markdown
# React Native Project

This is a React Native project that interacts with a Node.js backend server for image uploads and scanning. Follow the instructions below to set up and run the project on your local machine and Android device.

## Prerequisites

- Node.js and npm
- Docker and Docker Compose (for the Node.js backend)
- Android device with USB debugging enabled
- `adb` (Android Debug Bridge) installed
- `npx` and Expo CLI

## Getting Started

### 1. Setup and Start the Node.js Backend Server

First, you need to set up and start the Node.js backend server. Follow these steps:

1. **Navigate to the Backend Directory**

   If the backend server is in a different repository or directory, navigate to it:

   ```bash
   cd path/to/backend
   ```

2. **Build and Start the Backend Server with Docker Compose**

   Run the following command to build and start the services defined in `docker-compose.yml`:

   ```bash
   sudo docker-compose up -d
   ```

   This command will build the Docker images and start the services in detached mode.

3. **Run Initialization Script (`utils.js`)** (Only for the First Time)

   The `utils.js` script needs to be run only once to perform any necessary initialization tasks.

   ```bash
   node utils.js
   ```

4. **Start the Backend Server**

   Start the Node.js server with the following command:

   ```bash
   node server.js
   ```

   The server will start on port `3000`.

### 2. Configure the React Native Project

1. **Replace Backend URLs in React Native Code**

   - Open the files `upload.tsx` and `scanner.tsx` in your React Native project.
   - Replace the existing URLs with the IP address of your local machine and port `3000`.
   - The URLs should look like this:

     ```js
     'http://<your-ip>:3000'; // Replace <your-ip> with your actual IP
     ```

   - Example:
     ```js
     'http://192.168.133.56:3000';
     ```

### 3. Running the React Native App on Android Device

1. **Connect Your Android Phone to Your PC**

   - Connect your Android device to your PC via USB.
   - Ensure that USB debugging is enabled on the Android device.

2. **Verify `adb` is Installed and Device is Detected**

   - Run the following command to ensure `adb` is installed and your device is detected:

     ```bash
     adb devices
     ```

   - You should see your device listed.

3. **Run the React Native App**

   - Run the app on your Android device using Expo:

     ```bash
     npx expo run:android
     ```

   - This will build and deploy the app to the connected Android device.

### Important Notes

- **Ensure the Backend Server is Running:** Make sure the Node.js server is running and accessible from your Android device.
- **IP Address:** Replace `<your-ip>` with the local IP address of your machine where the backend server is running.
- **Network Connection:** Your Android device and the computer running the server should be on the same network.

### Troubleshooting

- **Network Issues:** If you face network issues, ensure that your Android device and computer are on the same network and the IP address is correctly set.
- **Backend Server Errors:** If the backend server fails to start, check the logs for errors and ensure all dependencies are installed.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### How to Use:
1. **Copy the above text** and save it as `README.md` in the root directory of your React Native project.
2. **Customize the sections** if necessary, such as adding a specific IP address or additional steps.