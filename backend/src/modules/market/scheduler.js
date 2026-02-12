import cron from 'node-cron';
import { marketService } from './services/market.service.js';

// Scheduled jobs for refreshing mandi prices.
// Runs hourly; Prometheus + logs can be used to monitor success/failures.

export function registerMarketJobs() {
  cron.schedule('0 * * * *', async () => {
    await marketService.refreshAll();
  });
}

