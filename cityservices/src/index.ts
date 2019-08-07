import cors from "cors"
import express from "express"
import * as path from "path"
import { createConnection } from "typeorm"
import { facilityListAction } from "./action/admin/facilityListAction"
import { facilityRemoveAction } from "./action/admin/facilityRemoveAction"
import { facilitySaveAction } from "./action/admin/facilitySaveAction"

import { bitsAction } from "./action/bitsAction"
import { completeAction } from "./action/completeAction"
import { registerAction } from "./action/registerAction"
import { serviceInfoAction } from "./action/serviceInfoAction"
import { servicesAction } from "./action/servicesAction"
import { trackAction } from "./action/trackAction"
import { FacilityEntity } from "./entity/FacilityEntity"
import { UsageEntity } from "./entity/UsageEntity"

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

  // admin api (for web interface)
  app.get("/facilities", facilityListAction)
  app.post("/facilities", facilitySaveAction)
  app.delete("/facilities/:id", facilityRemoveAction)

  // create a database connection
  await createConnection({
    type: "sqlite",
    database: __dirname + "/database.sqlite",
    synchronize: true,
    logging: false,
    entities: [FacilityEntity, UsageEntity],
  })

  // launch server
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5001
  app.listen(serverPort, () => {
    console.log(`Server is running at ${serverUrl}:${serverPort}`)
  })
}

bootstrap().catch(error => console.error(error))
