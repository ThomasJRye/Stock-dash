export interface QuoteData {
    symbol: string;
    name: string;
    price: number;
    changesPercentage: number;
    change: number;
    dayLow: number;
    dayHigh: number;
    yearHigh: number;
    yearLow: number;
    marketCap: number;
    priceAvg50: number;
    priceAvg200: number;
    exchange: string;
    volume: number;
    avgVolume: number;
    open: number;
    previousClose: number;
    eps: number;
    pe: number;
    earningsAnnouncement: string;
    sharesOutstanding: number;
    timestamp: number;
  }
  
  export interface HistoricalDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
    unadjustedVolume: number;
    change: number;
    changePercent: number;
    vwap: number;
    label: string;
    changeOverTime: number;
  }
  
  export interface HistoricalDataResponse {
    symbol: string;
    historical: HistoricalDataPoint[];
  }
  
  export interface StockPageProps {
    params: {
      name: string;
      symbol: string;
    };
  }

  export interface Stock {
    symbol: string;
    name: string;
    currency: string;
    stockExchange: string;
    exchangeShortName: string;
    price?: number | string;
    changesPercentage?: number | string;
    change?: number | string;
    marketCap?: number | string;
    lastTrade?: string | null;
  }

  type Params = {
    params: {
      symbol: string;
    };
  };
  