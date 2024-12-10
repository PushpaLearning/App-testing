// const { Expo } = require('expo-server-sdk');

// // Initialize an Expo SDK client
// const expo = new Expo();

// // Function to send push notification
// async function sendPushNotification(pushToken) {
//   // Validate the push token
//   if (!Expo.isExpoPushToken(pushToken)) {
//     console.error(`Invalid push token: ${pushToken}`);
//     return;
//   }

//   // Create the notification message
//   const message = {
//     to: pushToken,
//     sound: 'default',
//     body: 'This is a test notification from Node.js!',
//     data: { extraData: 'Some additional data for your app' },
//   };

//   // Send the notification
//   try {
//     // Chunk the message if necessary
//     const chunks = expo.chunkPushNotifications([message]);
//     const tickets = [];
//     for (let chunk of chunks) {
//       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       tickets.push(...ticketChunk);
//     }

//     console.log('Notification sent:', tickets);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// }

// // Test the function with a sample push token
// const samplePushToken = 'ExponentPushToken[R13FCtNklzGZjeTTtnOPT0]'; // Replace with your actual token
// sendPushNotification(samplePushToken);
//--------------------------------------------------------------------------------------------------------

const express = require('express');
const { Expo } = require('expo-server-sdk');
const bodyParser = require('body-parser');

const app = express();
const expo = new Expo();

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// API endpoint to receive push token and send a notification
app.post('/send-push-notification', async (req, res) => {
  const { pushToken } = req.body;

  if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
    return res.status(400).json({ error: 'Invalid push token' });
  }

  // Notification message
  const message = {
    to: pushToken,
    sound: 'default',
    body: 'Hello from the backend!',
    data: { extraData: 'This is some extra data' },
  };

  try {
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];
    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
    res.status(200).json({ message: 'Notification sent successfully', tickets });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Start the server and keep it running
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
