'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuditProject } from '@/types/audit';
import { useSupabase } from '@/contexts/SupabaseContext';
import { DetectedKey, detectKeysInHtml } from '@/lib/key-detection';
interface KeysTabProps {
  project: AuditProject;
  pageHtml?: string;
  pageUrl?: string;
  pageName?: string;
}
interface KeysData {
  keys: DetectedKey[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    status: string;
    severity: string;
  };
  summary: {
    totalKeys: number;
    exposedKeys: number;
    secureKeys: number;
    criticalKeys: number;
    highRiskKeys: number;
    analysisComplete: boolean;
    processingTime: number;
  };
}
export default function KeysTab({
  project,
  pageHtml,
  pageUrl: _pageUrl,
  pageName: _pageName
}: KeysTabProps) {
  const {
    getDetectedKeys
  } = useSupabase();
  const [keysData, setKeysData] = useState<KeysData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Load keys data from database with pagination and filtering
  const loadKeysData = useCallback(async (page = 1, limit = 20, status = 'all', severity = 'all') => {
    if (!project?.id) return;
    if (!getDetectedKeys) {
      // Fallback to client-side detection if function is not available
      if (pageHtml && pageHtml.length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await detectKeysInHtml(pageHtml);
          setKeysData({
            keys: result.keys,
            total: result.totalKeys,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(result.totalKeys / limit)),
            filters: {
              status,
              severity
            },
            summary: {
              totalKeys: result.totalKeys,
              exposedKeys: result.exposedKeys,
              secureKeys: result.secureKeys,
              criticalKeys: result.criticalKeys,
              highRiskKeys: result.highRiskKeys,
              analysisComplete: result.analysisComplete,
              processingTime: result.processingTime
            }
          });
        } catch (err) {
          setError('Failed to analyze keys data');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('Keys detection function not available');
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const {
        data,
        error
      } = await getDetectedKeys(project.id, page, limit, status, severity);
      if (error) {
        // Try fallback to client-side detection if HTML is available
        if (pageHtml && pageHtml.length > 0) {

          const result = await detectKeysInHtml(pageHtml);
          setKeysData({
            keys: result.keys,
            total: result.totalKeys,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(result.totalKeys / limit)),
            filters: {
              status,
              severity
            },
            summary: {
              totalKeys: result.totalKeys,
              exposedKeys: result.exposedKeys,
              secureKeys: result.secureKeys,
              criticalKeys: result.criticalKeys,
              highRiskKeys: result.highRiskKeys,
              analysisComplete: result.analysisComplete,
              processingTime: result.processingTime
            }
          });
          return;
        }
        console.error('Error loading keys data:', error);
        setError(`Failed to load keys data: ${error.message || 'Unknown error'}`);
        return;
      }
      if (data) {
        // If DB has no keys, try client-side detection as a convenience
        if ((data.total ?? 0) === 0 && pageHtml && pageHtml.length > 0) {
          const result = await detectKeysInHtml(pageHtml);
          setKeysData({
            keys: result.keys,
            total: result.totalKeys,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(result.totalKeys / limit)),
            filters: {
              status,
              severity
            },
            summary: {
              totalKeys: result.totalKeys,
              exposedKeys: result.exposedKeys,
              secureKeys: result.secureKeys,
              criticalKeys: result.criticalKeys,
              highRiskKeys: result.highRiskKeys,
              analysisComplete: result.analysisComplete,
              processingTime: result.processingTime
            }
          });
        } else {
          setKeysData(data);
        }
      }
    } catch (err) {
      // Fallback to client-side detection if HTML is available
      if (pageHtml && pageHtml.length > 0) {

        try {
          const result = await detectKeysInHtml(pageHtml);
          setKeysData({
            keys: result.keys,
            total: result.totalKeys,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(result.totalKeys / limit)),
            filters: {
              status,
              severity
            },
            summary: {
              totalKeys: result.totalKeys,
              exposedKeys: result.exposedKeys,
              secureKeys: result.secureKeys,
              criticalKeys: result.criticalKeys,
              highRiskKeys: result.highRiskKeys,
              analysisComplete: result.analysisComplete,
              processingTime: result.processingTime
            }
          });
        } catch (fallbackErr) {
          console.error('Fallback detection also failed:', fallbackErr);
          setError('Failed to analyze keys data');
        }
      } else {
        console.error('Unexpected error loading keys data:', err);
        setError('Unexpected error occurred while loading keys data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [project?.id, getDetectedKeys, pageHtml]);

  // Load data when component mounts or project changes
  useEffect(() => {
    if (project?.id) {
      setCurrentPage(1);
      setStatusFilter('all');
      setSeverityFilter('all');
      loadKeysData(1, itemsPerPage, 'all', 'all');
    }
  }, [project?.id, loadKeysData, itemsPerPage]);

  // Load data when page, items per page, or filters change
  useEffect(() => {
    if (project?.id) {
      loadKeysData(currentPage, itemsPerPage, statusFilter, severityFilter);
    }
  }, [currentPage, itemsPerPage, statusFilter, severityFilter, loadKeysData, project?.id]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (project?.id && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [statusFilter, severityFilter, project?.id, currentPage]);
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const LoadingSkeleton = () => <div className="">
      {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 border border-gray-300 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-4 bg-gray-200 w-1/4"></div>
                <div className="h-6 bg-gray-200 w-16"></div>
                <div className="h-6 bg-gray-200 w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 w-3/4"></div>
                <div className="h-3 bg-gray-200 w-1/2"></div>
                <div className="h-3 bg-gray-200 w-2/3"></div>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
  return <div className="s">
      
        <div className="flex items-start p-6">
          <div className="px-6">
            <h4 className="text-lg font-semibold text-gray-900 ">Security Keys Analysis</h4>
           
          </div>
       
      </div>

      {/* Loading State */}
      {isLoading && <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Loading keys data...</span>
          </div>
          <LoadingSkeleton />
        </div>}

      {/* Error State */}
      {error && <div className="border-y border-gray-300 p-4">
            <div className="flex items-start">
              <div className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex items-center justify-center">
                <span className="text-sm">❌</span>
              </div>
              <div>
              <h4 className="text-sm font-medium text-gray-900">Error</h4>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
          </div>
        </div>}

      {/* Analysis Results */}
      {!isLoading && !error && keysData && <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 mb-6 border-y border-gray-300">
            <div className="p-4 border-r text-center border-gray-300">
              <div className="text-2xl font-bold text-gray-900">{keysData.summary.totalKeys}</div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="p-4 border-r text-center border-gray-300">
              <div className="text-2xl font-bold text-gray-900">{keysData.summary.exposedKeys}</div>
              <div className="text-sm text-gray-600">Exposed</div>
            </div>
            <div className="p-4 border-r text-center border-gray-300">
              <div className="text-2xl font-bold text-gray-900">{keysData.summary.secureKeys}</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{keysData.summary.criticalKeys}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </div>

          {/* Filters */}
          <div className="border-y border-gray-300 p-4 mb-6 ">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-2 px-6">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 px-3 py-1 min-w-0 flex-1 sm:flex-none">
                    <option value="all">All Status</option>
                    <option value="exposed">Exposed</option>
                    <option value="secure">Secure</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Severity:</label>
                  <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="text-sm border border-gray-300 px-3 py-1 min-w-0 flex-1 sm:flex-none">
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <button onClick={() => {
              setStatusFilter('all');
              setSeverityFilter('all');
            }} className="text-sm text-gray-600 hover:text-gray-800 underline whitespace-nowrap">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Keys List */}
          {keysData.keys.length > 0 ? <div className="space-y-4 px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h4 className="text-md font-medium text-gray-700 px-6">
                  Detected Keys ({keysData.total} total, showing {keysData.keys.length})
                </h4>
                <div className="flex items-center space-x-2 px-6">
                  <span className="text-sm text-gray-500 whitespace-nowrap">Items per page:</span>
                  <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} className="text-sm border border-gray-300 px-2 py-1">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
                {keysData.keys.map((key, index) => (
                    <div key={key.id || index} className="bg-white border border-gray-300 p-4 hover:border-gray-400 transition-colors flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 truncate flex-1">{key.type}</h5>
                        <div className="flex flex-wrap gap-2 ml-2">
                          <span className={`px-2 py-1 text-xs font-medium border ${getSeverityColor(key.severity)}`}>
                            {key.severity}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium border ${key.status === 'exposed' ? 'bg-red-100 text-red-800 border-red-200' : key.status === 'secure' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                            {key.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Key:</span>
                          <div className="mt-1 font-mono text-xs break-all bg-gray-50 p-2 border border-gray-300">
                            {key.key}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Location:</span>
                          <div className="mt-1 font-mono text-xs break-all text-gray-500">
                            {key.location}
                          </div>
                        </div>
                        {key.description && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="mt-1 text-xs">{key.description}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-300">
                          <span className="font-medium">Confidence: <span className="text-gray-900">{key.confidence}%</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              {keysData.totalPages > 1 && <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, keysData.total)} of {keysData.total} results
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 px-2">
                      Page {currentPage} of {keysData.totalPages}
                    </span>
                    <button onClick={() => setCurrentPage(prev => Math.min(keysData.totalPages, prev + 1))} disabled={currentPage === keysData.totalPages} className="px-3 py-1 text-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>}
            </div> : <div className="text-center py-8">
              <div className="text-gray-500">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-300 flex items-center justify-center">
                  <span className="text-3xl">🔒</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Keys Detected</h4>
                <p className="text-gray-600">No security keys or credentials were found in the analyzed pages.</p>
              </div>
            </div>}
        </>}
    </div>;
}