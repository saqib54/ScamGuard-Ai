import serverless from 'serverless-http';
import { createExpressApp } from '../../server/app.ts';

const app = createExpressApp();

export const handler = serverless(app, {
  binary: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
});
