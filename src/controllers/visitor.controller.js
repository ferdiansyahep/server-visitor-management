const visitorService = require("../services/visitor.service");
let clients = [];

class VisitorController {

 subscribeStream(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);

    console.log("Client Connected:", clients.length);

    req.on("close", () => {
      clients = clients.filter(client => client !== res);
      console.log("Client Disconnected:", clients.length);
    });
  }

  async create(req, res) {
    try {
      const newVisitor = await visitorService.createVisitor(req.body);

      console.log("Broadcast ke", clients.length, "client");

      clients.forEach((client) => {
        client.write(`data: ${JSON.stringify(newVisitor)}\n\n`);
      });

      return res.status(201).json({
        success: true,
        data: newVisitor,
      });

    } catch (error) {
      console.error("Error creating visitor:", error);

      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the visitor.",
      });
    }
  }

  async getAll(req, res) {
    try {
      const visitors = await visitorService.getAllVisitors();

      return res.status(200).json({
        success: true,
        data: visitors,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching visitors.",
      });
    }
  }

  async getById(req, res) {
    try {
      const visitor = await visitorService.getVisitorById(req.params.id);

      if (!visitor) {
        return res.status(404).json({
          success: false,
          message: "Visitor not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: visitor,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching visitor.",
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedVisitor = await visitorService.deleteVisitor(req.params.id);

      return res.status(200).json({
        success: true,
        data: deletedVisitor,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting visitor.",
      });
    }
  }

  async getAiSummary(req, res) {
    try {
      const summary = await visitorService.generateAiSummary();

      return res.status(200).json({
        success: true,
        summary,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new VisitorController();