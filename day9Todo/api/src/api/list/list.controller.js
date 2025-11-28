const List = require("./list.model");

exports.getAllLists = async (req, res) => {
  try {
    console.log('req',req);
    console.log('req.params',req.params);
    console.log('req.query',req.query);
    const lists = await List.find().sort({ createdAt: -1 });
    return res.json({ isSuccess: true, message: "Lists fetched", data: lists });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, message: err.message });
  }
};

exports.createList = async (req, res) => {
  try {
    const list = await List.create(req.body);
    return res.json({ isSuccess: true, message: "List created", data: list });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, message: err.message });
  }
};

exports.updateList = async (req, res) => {
  try {
    const updated = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ isSuccess: true, message: "List updated", data: updated });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, message: err.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    return res.json({ isSuccess: true, message: "List deleted" });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, message: err.message });
  }
};



