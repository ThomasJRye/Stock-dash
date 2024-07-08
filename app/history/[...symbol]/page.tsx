'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactApexChart from 'react-apexcharts';

interface QuoteData {
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

interface HistoricalDataPoint {
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

interface HistoricalDataResponse {
  symbol: string;
  historical: HistoricalDataPoint[];
}

const StockPage = ({ params: { symbol } }) => {
  const router = useRouter();
  const apiKey = process.env.NEXT_PUBLIC_FINANCE_API_KEY;
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[] | null>(null);

    useEffect(() => {
    const fetchQuoteData = async () => {
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`);
        const data: QuoteData[] = await response.json();
        setQuoteData(data[0]); 
      } catch (error) {
        console.error("Error fetching quote data:", error);
      }
    };

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${apiKey}`);
        const data: HistoricalDataResponse = await response.json();
        setHistoricalData(data.historical); // Assuming data.historical contains the historical price data
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchQuoteData();
    fetchHistoricalData();
  }, [symbol, apiKey]);

  const chartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    title: {
      text: `${quoteData?.name} Stock Price`,
      align: 'center'
    },
    xaxis: {
      categories: historicalData ? historicalData.map(point => point.date) : [],
      labels: {
        format: 'dd MMM'
      }
    },
    yaxis: {
      title: {
        text: 'Price'
      }
    },
    series: [
      {
        name: 'Price',
        data: historicalData ? historicalData.map(point => point.close) : []
      }
    ]
  };

  return (
    <div className="stock-page-container">
      <button type="button" onClick={() => router.back()}>
        Click here to go back
      </button>
      <h1>{quoteData?.name}</h1>
      <h2>Symbol: {symbol}</h2>
      {quoteData && (
        <div>
          {/* <p>Price: {quoteData.price}</p>
          <p>Change: {quoteData.change}</p>
          <p>Change Percentage: {quoteData.changesPercentage}</p> */}
        </div>
      )}
      <div id="chart">
        {historicalData && <ReactApexChart series={chartOptions.series} type="line" height={350} />}
      </div>
    </div>
  );
};

export default StockPage;