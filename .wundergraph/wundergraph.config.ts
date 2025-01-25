import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

// Introspect the Travelport OpenAPI schema
const travelport = introspect.openApiV2({
  apiNamespace: 'travelport',
  source: {
    kind: 'file',
    filePath: '../open-apis/travelport-openAPI-v11.20.0.json',
  },
  headers: (builder) => {
    return builder
      .addStaticHeader('Authorization', new EnvironmentVariable('TRAVELPORT_API_KEY'))
      .addStaticHeader('Accept', 'application/json');
  },
  schemaExtension: `
    scalar JSON
    scalar Upload
  `,
});

configureWunderGraphApplication({
  apis: [travelport],
  server,
  operations,
  generate: {
    codeGenerators: [
      {
        templates: [templates.typescript.client],
        path: './generated',
      }
    ],
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
});