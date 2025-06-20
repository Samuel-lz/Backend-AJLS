const admin = require("firebase-admin");
const User = require("../models/User");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../firebaseServiceAccountKey.json"))
  });
}

async function authenticateFirebase(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No se proporcionó token" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Buscar usuario en MongoDB por su email
    const mongoUser = await User.findOne({ email: decodedToken.email });

    if (!mongoUser) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      mongoId: mongoUser._id // ✅ Aquí está el ID que se necesita en el quiz
    };

    next();
  } catch (error) {
    console.error("❌ Error en auth:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticateFirebase;
