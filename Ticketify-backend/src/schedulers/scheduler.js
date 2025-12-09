const dealsRepository = require('../repositories/deal.repository');

async function updateAllDealStatuses() {
    try {
        const deals = await dealsRepository.getAllDealsWithoutPagination();
        for (const deal of deals) {
            await dealsRepository.updateDealStatus(deal.deal_id);
        }
        console.log('Deal statuses updated successfully.');
    } catch (error) {
        console.error('Error updating deal statuses:', error.message);
    }
}

module.exports = { updateAllDealStatuses };