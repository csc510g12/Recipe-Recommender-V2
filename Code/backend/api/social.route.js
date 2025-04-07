import express from "express";
import SocialCtrl from "./social.controller.js";

const router = express.Router();

router.route("/", SocialCtrl.apiGetAllPosts);
router.route("/post", SocialCtrl.apiCreatePost);
router.route("/getPost", SocialCtrl.apiGetPostById);
router.route("/post/addComment", SocialCtrl.apiAddComments);

export default router;