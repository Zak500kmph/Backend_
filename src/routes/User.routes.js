import { Router } from "express";
import { loginUser, logoutUser, registerUser ,RefreshAccessToken} from "../controllers/user.controller.js";
import {multer_upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router=Router()

router.route("/reg").post(
multer_upload.fields([
    {name : "avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
])
,registerUser)
router.route("/login").post(loginUser)

//secure route
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh").post(RefreshAccessToken)



export default router