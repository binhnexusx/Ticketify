const dealsRepository = require("../repositories/deal.repository");

const dealsService = {
  getActiveDeals: async () => {
    return await dealsRepository.getActiveDeals();
  },

  getAllDeals: async ({ page, limit }) => {
    return await dealsRepository.getAllDeals({ page, limit });
  },

  getDealByRoomType: async (room_type) => {
    return await dealsRepository.getDealByRoomType(room_type);
  },

  createDeal: async (dealData) => {
    let discount = Number(dealData.discount_rate);
    if (discount > 1) {
      discount = discount / 100;
    }
    if (discount > 1) {
      discount = 1;
    }
    if (discount < 0) {
      discount = 0;
    }
    dealData.discount_rate = discount;
    return await dealsRepository.createDeal(dealData);
  },

  updateDeal: async (id, data) => {
    return await dealsRepository.updateDeal(id, data);
  },

  deleteDeal: async (id) => {
    return await dealsRepository.deleteDeal(id);
  },

  getDealById: async (id) => {
    return await dealsRepository.getDealById(id);
  },

  getDealsFiltered: async (status, startDate, endDate, limit, page) => {
    const offset = (page - 1) * limit;

    const [deals, total] = await Promise.all([
      dealsRepository.getDealsFiltered(status, startDate, endDate, limit, offset),
      dealsRepository.countDealsFiltered(status, startDate, endDate),
    ]);

    return {
      data: deals,
      total,
      totalPages: Math.ceil(total / limit),
    };
  },

  updateDealStatus: async (id, discount_rate) => {
    const rate = Number(discount_rate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      throw new Error("Discount rate must be between 0 and 100");
    }

    return await dealsRepository.updateDealStatus(id, rate);
  },

  getDealSummary: async () => {
    return await dealsRepository.getDealSummary();
  },
};

module.exports = dealsService;