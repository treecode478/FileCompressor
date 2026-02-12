// Lightweight FCM client wrapper.
// In production, we would add retries, exponential backoff, and better error logging.

import axios from 'axios';
import env from '../../../config/env.js';
import logger from '../../../config/logger.js';

const FCM_URL = 'https://fcm.googleapis.com/fcm/send';

export async function sendFcmNotification({ token, title, body, data }) {
  if (!env.fcmServerKey || !token) {
    return;
  }

  try {
    await axios.post(
      FCM_URL,
      {
        to: token,
        notification: {
          title,
          body
        },
        data
      },
      {
        headers: {
          Authorization: `key=${env.fcmServerKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
  } catch (err) {
    logger.error({ err }, 'Failed to send FCM notification');
  }
}

