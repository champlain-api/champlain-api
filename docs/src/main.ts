import SwaggerUI from "swagger-ui"
import "swagger-ui/dist/swagger-ui.css"
import docYAML from "/swagger-config.yaml?url"

SwaggerUI({
  dom_id: '#app',
  url: `${docYAML}`
})