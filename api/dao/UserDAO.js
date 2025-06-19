const User = require("../models/User");

class UserDAO {
  constructor() {
    this.model = User;
  }

  async create(req, res) {
    try {
      const document = new this.model(req.body);
            
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: `Error creating document: ${error.message}` });
    }
  }

  async getAll(req, res) {
    try {
      const items = await this.model.find();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: `Error fetching documents: ${error.message}` });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await this.model.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: `Error getting document: ${error.message}` });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: `Error updating document: ${error.message}` });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: `Error deleting document: ${error.message}` });
    }
  }
}

module.exports = UserDAO;
