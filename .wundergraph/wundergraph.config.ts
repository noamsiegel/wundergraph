import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

configureWunderGraphApplication({
  apis: [],
  server,
  operations,
  generate: {
    codeGenerators: [],
  },
  cors: {
    ...cors.allowAll,
    allowedOrigins: process.env.NODE_ENV === 'production' 
      ? ['http://localhost:3000'] 
      : ['http://localhost:3000'],
  },
  security: {
    enableGraphQLEndpoint: true,
  },
  authentication: {
    tokenBased: {
      providers: [
        {
          userInfoEndpoint: '/api/auth/token',
        }
      ]
    }
  }
});