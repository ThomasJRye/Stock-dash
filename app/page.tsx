'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import React from "react";
import { formatDistanceToNow } from 'date-fns';

import { Stock } from "./types";
import './ui/global.css';


export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_FINANCE_API_KEY;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  function convertToInt(value: string | number | undefined): number {
    console.log('Type of value:', typeof value);

    return parseInt((value ?? '').toString(), 10);
}

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  const fetchStockData = async (stocks: any[]) => {
    try {
      const stocksInfo = await Promise.all(
        stocks.map(async (stock: any) => {
          const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${stock.symbol}?&apikey=${apiKey}`);
          if (response.status === 429) {
            console.log('Too many requests. Please try again later.');
            setErrorMessage('Too many requests. Please try again later.');
            throw new Error('Too many requests. Please try again later.');
          }
          if (!response.ok) throw new Error(`Failed to fetch quote for ${stock.symbol}`);
          const quoteData = await response.json();

          if (quoteData && quoteData.length > 0) {
            return {
              ...stock,
              price: quoteData[0].price,
              change: +quoteData[0].change,
              changesPercentage: quoteData[0].changesPercentage,
              marketCap: quoteData[0].marketCap,
              lastTrade: formatDistanceToNow(new Date(quoteData[0].timestamp * 1000), { addSuffix: true }),
            };
          } else {
            return {
              ...stock,
              price: 'N/A',
              changes: 'N/A',
              marketCap: 'N/A',
              lastTrade: null,
            };
          }
        })
      );
      setResults(stocksInfo);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') return;
    const offset = (page - 1) * limit;

    const responseCIKs = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&offset=${offset}&apikey=${apiKey}`);
    if (responseCIKs.status === 429) {
      setErrorMessage('Too many requests. Please try again later.');
    }
    const CIKs = await responseCIKs.json();
    if (CIKs.length === 0) {
      setErrorMessage("No results found.");
      return;
    } else {
      setAllStocks(CIKs);
      setTotalResults(CIKs.length);

      const stocks = CIKs.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        currency: stock.currency,
        stockExchange: stock.stockExchange,
        exchangeShortName: stock.exchangeShortName,
      }));
      fetchStockData(stocks);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const offset = (newPage - 1) * limit;
    const stocks = allStocks.slice(offset, offset + limit).map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.name,
      currency: stock.currency,
      stockExchange: stock.stockExchange,
      exchangeShortName: stock.exchangeShortName,
    }));
    fetchStockData(stocks);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalResults);

  return (
    <main className="flex min-h-screen min-w-screen md:w-f flex-col items-center bg-gradient-to-r from-purple-800 to-blue-600 p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:w-200">
        <p className={`text-4xl font-bold text-white text-center ${results.length > 0 ? '' : 'pt-[75%]'}`}>
          Veyt Assignment
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full pt-[50px]">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            style={{ backgroundColor: "rgb(55, 68, 107)", borderColor: "rgb(73 90 143)", color: "white" }}
            className="rounded-3xl border border-gray-200 py-2 px-4 text-gray-700 w-[350px] "
            placeholder="Search for a Stock..."
          />
        </form>

        {results.length > 0 && (
          <div className="mt-6">
            <table className="min-w-full shadow-md rounded-lg overflow-hidden">
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
                <tr key={result.symbol} style={{ backgroundColor: index % 2 === 0 ? "rgb(55, 68, 107)" : "rgb(45, 58, 97)" }}>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.symbol || 'Unknown'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.name || 'Unknown'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.currency || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.stockExchange || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.exchangeShortName || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.price || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className={`${result.change !== undefined && +result.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4">{result.change + " (" + result.changesPercentage + "%)" || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.marketCap || 'N/A'}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link href={`/history/${result.symbol}`}>
                      <span className="py-2 px-4 text-white">{result.lastTrade || 'N/A'}</span>
                    </Link>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between pt-4">
              <select
                value={limit}
                onChange={handleLimitChange}
                style={{ backgroundColor: "rgb(55, 68, 107)", borderColor: "rgb(73 90 143)", color: "white" }}
                className="rounded-md border border-gray-200 py-2 px-4 text-gray-700 hover:bg-gray-300"
              >
                <option value={5}>5 Items</option>
                <option value={10}>10 Items</option>
                <option value={15}>15 Items</option>
              </select>

              <div className="flex rounded-md items-center space-x-2" style={{ backgroundColor: "rgb(221, 221, 221)", borderColor: "rgb(21 90 143)", color: "white" }}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <span className="text-black">&lt;</span>
                  </button>
                <span className="text-black">
                  {startIndex}-{endIndex} of {totalResults}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={endIndex >= totalResults}
                  className="px-4 py-2 rounded-md bg-gray hover:bg-gray-300 disabled:opacity-50"
                >
                  <span className="text-black">&gt;</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {errorMessage && <p className="text-red-500 position absolute">{errorMessage}</p>}
      </div>
    </main>
  );
}