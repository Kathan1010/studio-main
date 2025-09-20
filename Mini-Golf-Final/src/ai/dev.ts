
/**
 * @fileoverview This file is used to configure and launch the Genkit developer
 *     UI. It is not used in production.
 */

import {genkit} from 'genkit';
import {googleAI}d from '@genkit-ai/googleai';

export default genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
