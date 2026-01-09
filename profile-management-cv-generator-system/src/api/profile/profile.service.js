const Profile = require("../../models/profileModel");
const path = require("path");
const fs = require("fs");

const saveProfile = async (userId, data, file) => {
  try {
    const existing = await Profile.findOne({ userId });

    // IMAGE
    let imagePath = existing?.profileImage || null;

    if (file) {
      const uploadDir = "uploads/profile";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${userId}-${Date.now()}${path.extname(file.originalname)}`;
      const fullPath = path.join(uploadDir, fileName);

      fs.writeFileSync(fullPath, file.buffer);
      imagePath = `/uploads/profile/${fileName}`;
    }

    // STRENGTHS
    let strengths = existing?.strengths || [];
    if (data.strengths) {
      const incoming = JSON.parse(data.strengths);
      strengths = incoming.map((s) => ({
        title: s.title,
        description: s.description || s.desc || "",
      }));
    }

    // LANGUAGES
    let languages = existing?.languages || [];
    if (data.languages) {
      const incoming = JSON.parse(data.languages);
      languages = incoming.map((l) => ({
        name: l.name,
        level: l.level,
        rating: Number(l.rating) || 0,
      }));
    }

    const profileData = {
      ...(existing ? existing.toObject() : {}),

      fullName: data.fullName ?? existing?.fullName,
      email: data.email ?? existing?.email,
      phone: data.phone ?? existing?.phone,
      address: data.address ?? existing?.address,
      linkedinId: data.linkedinId ?? existing?.linkedinId,

      xId:
        data.xId !== undefined
          ? data.xId
          : existing?.xId,

      summary: data.summary ?? existing?.summary,
      headline: data.headline ?? existing?.headline,

      profileImage: imagePath,
      strengths,
      languages,

      userId,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, upsert: true }
    );

    return { status: 200, data: profile };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getProfile = async (userId) => {
  const profile = await Profile.findOne({ userId });
  return { data: profile };
};

const deleteProfile = async (userId) => {
  const profile = await Profile.findOneAndDelete({ userId });
  return { data: profile };
};

module.exports = {
  saveProfile,
  getProfile,
  deleteProfile,
};
