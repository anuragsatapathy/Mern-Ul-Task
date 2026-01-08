const path = require("path");
const ConferenceAndCourse = require(
  path.resolve(__dirname, "../../models/conferenceCourse.model")
);

const createConferenceAndCourse = async (data) => {
  try {
    const item = new ConferenceAndCourse(data);
    await item.save();

    return {
      status: 200,
      message: "Conference/Course created successfully!",
      data: item,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getConferenceAndCourses = async ({ userId }) => {
  try {
    const items = await ConferenceAndCourse.find({
      userId,
      isDeleted: false,
    });

    return { status: 200, data: items };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getConferenceAndCourseById = async (id) => {
  try {
    const item = await ConferenceAndCourse.findById(id);

    if (!item) {
      return { status: 404, message: "Record not found" };
    }

    return { status: 200, data: item };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const updateConferenceAndCourse = async (id, data) => {
  try {
    const item = await ConferenceAndCourse.findByIdAndUpdate(id, data, {
      new: true,
    });

    return {
      status: 200,
      message: "Updated successfully!",
      data: item,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const deleteConferenceAndCourse = async (id) => {
  try {
    const item = await ConferenceAndCourse.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return {
      status: 200,
      message: "Deleted successfully!",
      data: item,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createConferenceAndCourse,
  getConferenceAndCourses,
  getConferenceAndCourseById,
  updateConferenceAndCourse,
  deleteConferenceAndCourse,
};
