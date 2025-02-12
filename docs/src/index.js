import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';

const spec = require('./swagger-config.yaml');

const ui = SwaggerUI({
  spec,
  dom_id: '#swagger',
  // supportedSubmitMethods: [], // Disables the "Try it out" button. https://stackoverflow.com/a/68313189
});

ui.initOAuth({
  appName: "Swagger UI Webpack Demo",
  // See https://demo.identityserver.io/ for configuration details.
  clientId: 'implicit'
});