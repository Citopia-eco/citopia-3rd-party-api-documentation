import express from "express"
import cors from "cors"
import { createConnection } from "typeorm"
import * as path from "path"
import { servicesAction } from "./action/servicesAction"
import { bitsAction } from "./action/bitsAction"
import { serviceInfoAction } from "./action/serviceInfoAction"
import { registerAction } from "./action/registerAction"
import { completeAction } from "./action/completeAction"
import { trackAction } from "./action/trackAction"
import { TripEntity } from "./entity/TripEntity"
import bodyParser = require("body-parser")

async function bootstrap() {
  // create express server
  const app = express()

  // setup express server
  app.use(cors())
  app.use(bodyParser.json())
  app.use(
    "/assets/images",
    express.static(path.resolve(__dirname + "/../assets/images")),
  )

  // api for citopia
  app.get("/services", servicesAction)
  app.get("/bits", bitsAction)
  app.get("/service-info", serviceInfoAction)
  app.get("/register", registerAction)
  app.get("/complete", completeAction)
  app.get("/track", trackAction)

  // create a database connection
  await createConnection({
    type: "sqlite",
    database: __dirname + "/database.sqlite",
    synchronize: true,
    logging: false,
    entities: [TripEntity],
  })

  // launch server
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Server is running at ${serverUrl}:${port}`)
  })
}

bootstrap().catch(error => console.error(error))
