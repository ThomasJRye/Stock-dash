'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactApexChart from 'react-apexcharts';
import { QuoteData, HistoricalDataPoint, HistoricalDataResponse } from '../../types';
import '../../ui/global.css';

type Params = {
  params: {
    symbol: string;
  };
};


const StockPage = ({ params: { symbol } }: Params) => {
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
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const filteredData = data.historical.filter(point => new Date(point.date) >= oneMonthAgo);
      const reversedData = filteredData.reverse();

      setHistoricalData(reversedData); // Use the filtered and reversed data
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchQuoteData();
    fetchHistoricalData();
  }, [symbol, apiKey]);

  const chartOptions = {
    // Define your chart options here
    series: [
      {
        name: 'Price',
        data: historicalData ? historicalData.map(point => point.close) : []
      },
    ],
    xaxis: {
      categories: historicalData ? historicalData.map(point => point.date) : []
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-blue-600">
      <div className="flex items-center space-x-4 mb-4">
        <button type="button" onClick={() => router.back()} className="mb-4 px-4 py-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{quoteData?.name}</h1>
          <h2 className="text-2xl text-gray-300 mb-4">Symbol: {symbol}</h2>
        </div>
      </div>
      <div id="chart" className="bg-white rounded-lg shadow-lg p-6" style={{ width: '600px' }}>
        {historicalData && <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            height={350}
          />}
      </div>
    </div>
  );
  
};

export default StockPage;