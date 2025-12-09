export interface Deal{
    deal_id: number,
    deal_name: string,
    discount_rate: number,
    start_date: string,
    end_date: string,
    status: string
}

export type Deals = Deal[]

export interface PaginatedDealResponse {
  items: Deal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
