'use client';

import { useState, useEffect, use } from "react";

interface Stock {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
  price?: number | string;
  changes?: number | string;
  marketCap?: number | string;
  lastTrade?: string | null;
}

const mockData: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 150, changes: 1.5, marketCap: "2.4T", lastTrade: "2024-07-07" },
  { symbol: "GOOGL", name: "Alphabet Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 2800, changes: -0.5, marketCap: "1.5T", lastTrade: "2024-07-07" },
  { symbol: "MSFT", name: "Microsoft Corp.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 300, changes: 0.3, marketCap: "2.1T", lastTrade: "2024-07-07" },
  { symbol: "AMZN", name: "Amazon.com Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 3500, changes: 2, marketCap: "1.7T", lastTrade: "2024-07-07" },
  { symbol: "TSLA", name: "Tesla Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 700, changes: -1, marketCap: "800B", lastTrade: "2024-07-07" },
  { symbol: "NFLX", name: "Netflix Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 600, changes: 0.6, marketCap: "300B", lastTrade: "2024-07-07" },
  { symbol: "FB", name: "Meta Platforms Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 350, changes: 0.1, marketCap: "1.0T", lastTrade: "2024-07-07" },
  { symbol: "NVDA", name: "NVIDIA Corporation", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 200, changes: -0.2, marketCap: "500B", lastTrade: "2024-07-07" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 250, changes: 0.5, marketCap: "300B", lastTrade: "2024-07-07" },
  { symbol: "INTC", name: "Intel Corporation", currency: "USD", stockExchange: "NASDAQ", exchangeShortName: "NASDAQ", price: 60, changes: -0.1, marketCap: "200B", lastTrade: "2024-07-07" },
  // Add more mock data as needed
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_FINANCE_API_KEY;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (query.trim() === '') return;
  //   const offset = (page - 1) * limit;

  //   const responseCIKs = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=${limit}&offset=${offset}&apikey=${apiKey}`);
  //   const CIKs = await responseCIKs.json();
  //   setTotalResults(CIKs.length)

  //   const stocks = CIKs.slice(0, limit).map((stock: any) => ({
  //     symbol: stock.symbol,
  //     name: stock.name,
  //     currency: stock.currency,
  //     stockExchange: stock.stockExchange,
  //     exchangeShortName: stock.exchangeShortName,
  //   }));

  //   const stocksInfo = await Promise.all(stocks.map(async (stock: any) => {
  //     const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${stock.symbol}?&apikey=${apiKey}`);
  //     const quoteData = await response.json();

  //     if (quoteData && quoteData.length > 0) {
  //       return {
  //         ...stock,
  //         price: quoteData[0].price,
  //         changes: quoteData[0].changes,
  //         marketCap: quoteData[0].marketCap,
  //         lastTrade: quoteData[0].lastTrade,
  //       };
  //     } else {
  //       return {
  //         symbol: stock.symbol,
  //         name: stock.name,
  //         currency: stock.currency,
  //         stockExchange: stock.stockExchange,
  //         exchangeShortName: stock.exchangeShortName,
  //         price: 'N/A',
  //         changes: 'N/A',
  //         marketCap: 'N/A',
  //         lastTrade: null,
  //       };
  //     }
  //   }));
  //   setResults(stocksInfo);

  // };

  const handlePageChange = (newPage: number) => {
    console.log(page)
    setPage(newPage);
    console.log(page)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (page - 1) * limit;
        const filteredData = mockData.filter(stock => stock.name.toLowerCase().includes(query.toLowerCase()) || stock.symbol.toLowerCase().includes(query.toLowerCase()));
        const paginatedData = filteredData.slice(offset, offset + limit);
        setResults(paginatedData);
        setTotalResults(filteredData.length);
        setErrorMessage(null); // Clear any previous error messages
      } catch (error) {
        setErrorMessage("An error occurred while fetching data. Please try again later.");
        setResults([]);
        setTotalResults(0);
      }
    };

    fetchData();
  }, [query, page, limit]);

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalResults);

  console.log(startIndex, endIndex, totalResults, page)
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-purple-800 to-blue-600 p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:w-2/3">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 p-6 shadow-lg">
          <p className="text-3xl font-bold text-gray-800 text-center">
            Veyt Assignment
          </p>
          <form className="flex flex-col items-center space-y-4">

          {/* <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4"> */}
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="w-1/2 rounded-md border border-gray-200 py-2 px-4 text-gray-700"
              placeholder="Search for a Stock..."
            />
          </form>
        </div>
        {results.length > 0 && (
          <div className="mt-6">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Currency</th>
                  <th className="py-2 px-4">Stock Exchange</th>
                  <th className="py-2 px-4">Exchange Short Name</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Changes</th>
                  <th className="py-2 px-4">Market Cap</th>
                  <th className="py-2 px-4">Last Trade</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.symbol} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                    <td className="py-2 px-4">{result.symbol || 'Unknown'}</td>
                    <td className="py-2 px-4">{result.name || 'Unknown'}</td>
                    <td className="py-2 px-4">{result.currency || 'N/A'}</td>
                    <td className="py-2 px-4">{result.stockExchange || 'N/A'}</td>
                    <td className="py-2 px-4">{result.exchangeShortName || 'N/A'}</td>
                    <td className="py-2 px-4">{result.price || 'N/A'}</td>
                    <td className="py-2 px-4">{result.changes || 'N/A'}</td>
                    <td className="py-2 px-4">{result.marketCap || 'N/A'}</td>
                    <td className="py-2 px-4">{result.lastTrade || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        <select
          value={limit}
          onChange={handleLimitChange}
          className="w-1/2 rounded-md border border-gray-200 py-2 px-4 text-gray-700"
        >
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={15}>15 Items</option>
        </select>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          &lt;
        </button>
        <span className="text-gray-700">
          {startIndex}-{endIndex} of {totalResults}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={endIndex >= totalResults}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </main>
  );
}