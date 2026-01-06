const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedinId: String,
    summary: String,

    
    headline: String,

    profileImage: String,

    strengths: [
      {
        title: String,
        description: String,
      },
    ],

   
    languages: [
      {
        name: String,
        level: String, 
        rating: Number, 
      },
    ],

    selectedTemplate: { type: String, default: "template1" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);


