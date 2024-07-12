import { json, Router } from "express";
import { loginUser, logoutUser, registerUser ,RefreshAccessToken,changeUserCurrentPassword, getUser, updateUserCredential,changeUserAvatar,updateUserCoverImage} from "../controllers/user.controller.js";
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
router.route("/refresh").post(RefreshAccessToken);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/changePassword").post(verifyJWT,changeUserCurrentPassword);
router.route("/getUser").post(verifyJWT,getUser)
router.route("/changeDetails").post(verifyJWT,updateUserCredential)
router.route("/changeAvatar").post(multer_upload.single("avatar"),verifyJWT,changeUserAvatar)
router.route("/changeCoverImage").post(multer_upload.single("coverImage"),verifyJWT,updateUserCoverImage)



export default router