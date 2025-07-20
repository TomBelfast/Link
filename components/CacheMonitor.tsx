'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface CacheStats {
  status: string;
  timestamp: string;
  keys: {
    links: boolean;
    ideas: boolean;
  };
}

export default function CacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fetchCacheStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cache');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      toast.error('Failed to fetch cache stats');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (pattern?: string) => {
    try {
      setLoading(true);
      const url = pattern ? `/api/cache?pattern=${pattern}` : '/api/cache';
      const response = await fetch(url, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message);
      await fetchCacheStats();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const warmCache = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cache/warm', { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message);
      await fetchCacheStats();
    } catch (error) {
      console.error('Error warming cache:', error);
      toast.error('Failed to warm cache');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCacheStats();
      const interval = setInterval(fetchCacheStats, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        📊 Cache Monitor
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Cache Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {loading && (
        <div className="text-center py-2">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      )}

      {stats && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                stats.status === 'connected' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {stats.status}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-300 mb-2">Cached Keys:</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Links:</span>
                <span className={stats.keys.links ? 'text-green-400' : 'text-red-400'}>
                  {stats.keys.links ? '✓ Cached' : '✗ Not cached'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ideas:</span>
                <span className={stats.keys.ideas ? 'text-green-400' : 'text-red-400'}>
                  {stats.keys.ideas ? '✓ Cached' : '✗ Not cached'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-600">
            <button
              onClick={() => fetchCacheStats()}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
            >
              🔄 Refresh
            </button>
            
            <button
              onClick={() => warmCache()}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
            >
              🔥 Warm Cache
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => clearCache('links:*')}
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
              >
                Clear Links
              </button>
              
              <button
                onClick={() => clearCache('ideas:*')}
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
              >
                Clear Ideas
              </button>
            </div>
            
            <button
              onClick={() => clearCache()}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
            >
              🗑️ Clear All Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
}