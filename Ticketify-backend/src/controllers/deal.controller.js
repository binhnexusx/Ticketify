const dealService = require("../services/deal.service");

const dealController = {
  getAllActiveDeals: async (req, res) => {
    try {
      const deals = await dealService.getActiveDeals();
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getAllDeals: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const deals = await dealService.getAllDeals({ page, limit });
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealByRoomTypeController: async (req, res) => {
    try {
      const roomType = req.params.id;
      const deals = await dealService.getDealByRoomType(roomType);
      res.json({ status: "success", data: deals });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  createDeal: async (req, res) => {
    try {
      let { discount_rate, ...rest } = req.body;
      let discount = Number(discount_rate);
      if (discount > 1) {
        discount = discount / 100;
      }
      if (discount > 1) discount = 1;
      if (discount < 0) discount = 0;
      const newDeal = await dealService.createDeal({
        ...rest,
        discount_rate: discount,
      });
      res.status(201).json({
        status: "success",
        data: newDeal
      });
    } catch (err) {
      if (err.message.includes("overlaps")) {
        return res.status(400).json({ status: "error", message: err.message });
      }
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  updateDeal: async (req, res) => {
    try {
      let { discount_rate } = req.body;
      discount_rate = Number(discount_rate);
      if (isNaN(discount_rate) || discount_rate < 0 || discount_rate > 100) {
        return res.status(400).json({
          status: "error",
          message: "Discount rate must be between 0 and 100",
        });
      }
      req.body.discount_rate = discount_rate;
      const updated = await dealService.updateDeal(req.params.id, req.body);
      res.json({ status: "success", data: updated });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  deleteDeal: async (req, res) => {
    try {
      const deleted = await dealService.deleteDeal(req.params.id);
      res.json({ status: "success", data: deleted });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealByIdController: async (req, res) => {
    try {
      const deal = await dealService.getDealById(req.params.id);
      if (!deal) {
        return res.status(404).json({ status: "error", message: "Deal not found" });
      }
      res.json({ status: "success", data: deal });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealsFilteredController: async (req, res) => {
    try {
      const status = req.query.status || null;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const startDate = req.query.startDate || null;
      const endDate = req.query.endDate || null;

      const result = await dealService.getDealsFiltered(
        status,
        startDate,
        endDate,
        limit,
        page
      );

      res.json({
        status: "success",
        items: result.data,
        total: result.total,
        totalPages: result.totalPages,
        page,
        limit,
        startDate,
        endDate,
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  getDealSummaryController: async (req, res) => {
    try {
      const summary = await dealService.getDealSummary();
      res.json({ status: "success", data: summary });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

module.exports = dealController;