import SwaggerUI from 'swagger-ui'
import "swagger-ui/dist/swagger-ui.css"

SwaggerUI({
    dom_id: '#swagger',
    url: "https://raw.githubusercontent.com/champlain-api/champlain-api/refs/heads/logan-swagger/docs/src/swagger-config.yaml"
  })