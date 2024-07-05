import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {multer_upload} from "../middlewares/multer.middleware.js"
const router=Router()

router.route("/reg").post(
multer_upload.fields([
    {name : "avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
])
,registerUser)



export default router