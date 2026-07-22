exports.getOpenApi = (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Global Analytics API',
      version: '1.0.0',
      description: 'OpenAPI specification for the Global Analytics and Situation Awareness platform.',
    },
    servers: [{ url: '/api/v1' }],
    paths: {
      '/auth/login': {
        post: {
          summary: 'Authenticate user',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
          responses: { '200': { description: 'Authenticated' } },
        },
      },
      '/reports/generate/{type}/{format}': {
        get: {
          summary: 'Generate report file',
          parameters: [
            { name: 'type', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'format', in: 'path', required: true, schema: { type: 'string', enum: ['csv', 'excel', 'pdf', 'xlsx'] } },
          ],
          responses: { '200': { description: 'Report generated' } },
        },
      },
      '/health': {
        get: { summary: 'Health check', responses: { '200': { description: 'API healthy' } } },
      },
    },
  });
};

exports.getDocsPage = (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Documentation</title>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</head>
<body>
  <redoc spec-url='/api/v1/openapi.json'></redoc>
</body>
</html>`);
};
