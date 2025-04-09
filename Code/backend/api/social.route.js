import express from "express";
import SocialCtrl from "./social.controller.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.route("/").get(SocialCtrl.apiGetAllPosts);
router.route("/post").post(SocialCtrl.apiCreatePost);
router.route("/:id").get(SocialCtrl.apiGetPostById);
router.route("/post/addComment").post(SocialCtrl.apiAddComments);
router.route("/post/addLike").post(SocialCtrl.apiAddLike);

router.post("/uploadImage", upload.single("image"), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(500).json({ error: "Error uploading image" });
    }

    const imageUrl = `http://localhost:3003/uploads/${file.filename}`;
    res.json({ imageUrl });
})

export default router;