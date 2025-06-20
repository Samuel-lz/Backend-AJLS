const Quiz = require("../models/Quiz");

class QuizDAO {
    constructor(){
        this.model = Quiz;
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


}

module.exports = QuizDAO;