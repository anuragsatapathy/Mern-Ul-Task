const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../../uploads",
    req.params.filename
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
});

module.exports = router;
