import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 5,
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
		const extname = allowedTypes.test(file.originalname.toLowerCase());
		const mimetype = allowedTypes.test(file.mimetype);

		if (mimetype && extname) {
			return cb(null, true);
		}

		cb(new Error("Invalid file type"));
	},
});

export default upload;
