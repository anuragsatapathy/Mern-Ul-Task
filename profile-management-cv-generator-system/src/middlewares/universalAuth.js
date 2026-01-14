const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const User = require("../models/userModel");
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin with service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

   
    try {
      const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decodedJwt.id };
      return next();
    } catch (e) {}

    
    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token);

      let user = await User.findOne({ email: decodedFirebase.email });

      if (!user) {
        user = await User.create({
          email: decodedFirebase.email,
          name: decodedFirebase.name || decodedFirebase.email,
          authProvider: "google",
        });
      }

      req.user = { id: user._id };
      return next();
    } catch (e) {
      console.error("Firebase token verification failed:", e);
      return res.status(401).json({ message: "Invalid token" });
    }

  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
