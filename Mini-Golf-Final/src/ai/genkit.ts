
'use server';

import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval, GenkitMetric} from '@genkit-ai/evaluator';
import {dotprompt} from '@genkit-ai/dotprompt';
import {firebase} from '@genkit-ai/firebase';

configureGenkit({
  plugins: [
    googleAI({
      apiVersion: ['v1', 'v1beta'],
    }),
    genkitEval({
      judge: 'googleai/gemini-1.5-flash-latest',
      metrics: [GenkitMetric.Faithfulness, GenkitMetric.AnswerRelevancy],
      embedder: 'googleai/text-embedding-004',
    }),
    dotprompt(),
    firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export {ai} from 'genkit';
