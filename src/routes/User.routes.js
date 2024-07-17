import { json, Router } from "express";
import { loginUser,
     logoutUser, 
     registerUser 
     ,RefreshAccessToken,
     changeUserCurrentPassword, 
     getUser,
      updateUserCredential,
      changeUserAvatar,
      updateUserCoverImage ,
      getUserInfo,
      getUserhistory} from "../controllers/user.controller.js";
      import {verifyJWT} from "../middlewares/auth.middleware.js"
      import {multer_upload} from "../middlewares/multer.middleware.js"
const router=Router()

router.route("/reg").post((res,req,next)=>{console.log("testing");next()},
    multer_upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secure route
router.route("/refresh").post(RefreshAccessToken);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/changePassword").post(verifyJWT,changeUserCurrentPassword);
router.route("/getUser").post(verifyJWT,getUser)
router.route("/changeDetails").patch(verifyJWT,updateUserCredential)// if we want to modify particular field
router.route("/changeAvatar").patch(verifyJWT,multer_upload.single("avatar"),changeUserAvatar)
router.route("/changeCoverImage").patch(verifyJWT,multer_upload.single("coverImage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserInfo)
router.route("/watchHistory").get(verifyJWT,getUserhistory)



export default router