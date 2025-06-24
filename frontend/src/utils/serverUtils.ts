/**
 * Simply attempts to wake up the server via HTTP request
 * @param websocketUrl The WebSocket URL to convert to HTTP URL
 */
export async function wakeUpServer(websocketUrl: string): Promise<void> {
  try {
    // Convert WebSocket URL to HTTP URL
    const httpUrl = websocketUrl
      .replace('ws://', 'http://')
      .replace('wss://', 'https://');

    const wakeUpUrl = `${httpUrl}/wake-up`;

    // Send the request but don't wait for or process the response
    fetch(wakeUpUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    }).catch(() => {
      // Only log to console if there's an error
      console.log('Backend appears to be down. It might be starting up soon...');
    });
  } catch (_) {
    // Silently ignore any errors
  }
}
