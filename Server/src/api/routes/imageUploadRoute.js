const Router = require("express").Router();
const cloudinary = require("cloudinary");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Upload image
Router.post("http://localhost:5000/api/imageUpload", (req, res) => {
	try {
		if (!req.files || Object.keys(req.files).length === 0)
			return res
				.status(400)
				.json({ msg: "No files were uploaded." });

		const file = req.files.file;
		if (file.size > 1024 * 1024) {
			removeTmp(file.tempFilePath);
			return res.status(400).json({ msg: "Size too large" });
		}
		if (
			file.mimetype !== "image/jpeg" &&
			file.mimetype !== "image/png"
		) {
			removeTmp(file.tempFilePath);
			return res
				.status(400)
				.json({ msg: "File format is incorrect." });
		}
		cloudinary.v2.uploader.upload(
			file.tempFilePath,
			{ folder: "ProductImages" },
			async (err, result) => {
				if (err) throw err;
				removeTmp(file.tempFilePath);
				res.json({
					message: "image uploaded successfully",
					url: result.secure_url,
				});
			},
		);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});
// Delete image only admin can use
Router.post("/imageDestroy", (req, res) => {
	try {
		const { public_id } = req.body;
		if (!public_id)
			return res.status(400).json({ msg: "No images Selected" });
		cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
			if (err) throw err;
			res.json({ msg: "Deleted Image" });
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});
const removeTmp = (path) => {
	fs.unlink(path, (err) => {
		if (err) throw err;
	});
};

module.exports = Router;
