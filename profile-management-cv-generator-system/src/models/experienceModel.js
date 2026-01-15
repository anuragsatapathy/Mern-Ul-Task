const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          // if currently working → toDate must be null
          if (this.currentlyWorking === true) {
            return value === null;
          }

          // if not currently working → toDate must exist
          if (this.currentlyWorking === false) {
            return value !== null;
          }

          return true;
        },
        message:
          "toDate must be null when currentlyWorking is true, and required when currentlyWorking is false",
      },
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);

