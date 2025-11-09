import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DataVisualization as DataVizType } from "@/data/case1-story";
import { BarChart3, Table2, FileText, X, Clock, Network, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { IPMatchingPuzzle } from "./IPMatchingPuzzle";
import { WinRatePrediction } from "./WinRatePrediction";

interface DataVisualizationProps {
  visualization: DataVizType;
}

export function DataVisualization({ visualization }: DataVisualizationProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [logFilters, setLogFilters] = useState({
    users: [] as string[],
    actions: [] as string[],
    timeRange: 'all' as string,
  });
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  useEffect(() => {
    setSelectedPoint(null);
    setLogFilters({
      users: [],
      actions: [],
      timeRange: 'all',
    });
    setPuzzleCompleted(false);
  }, [visualization.type, visualization.title]);
  const renderChart = () => {
    const { data, interactive, pointDetails } = visualization;
    const chartData = data.labels.map((label: string, index: number) => {
      const point: any = { name: label, index };
      data.datasets.forEach((dataset: any) => {
        point[dataset.label] = dataset.data[index];
      });
      return point;
    });

    const handlePointClick = (data: any) => {
      if (interactive && data && data.activePayload && data.activePayload[0]) {
        const pointIndex = data.activePayload[0].payload.index;
        setSelectedPoint(pointIndex);
      }
    };

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart 
            data={chartData} 
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            onClick={handlePointClick}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" domain={[0, 100]} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#111827',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {data.datasets.map((dataset: any, index: number) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.color}
                strokeWidth={2}
                dot={{ r: 4, cursor: interactive ? 'pointer' : 'default' }}
                activeDot={{ r: 6, cursor: interactive ? 'pointer' : 'default' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {interactive && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Click on data points to see more details
          </div>
        )}

        <AnimatePresence>
          {selectedPoint !== null && pointDetails && pointDetails[selectedPoint] && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setSelectedPoint(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-[90%] z-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {pointDetails[selectedPoint].label}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      {pointDetails[selectedPoint].event}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {pointDetails[selectedPoint].description}
                </p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-900">
                    Win Rate: {data.datasets[0].data[selectedPoint]}%
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  };

  const renderTable = () => {
    const { data } = visualization;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {data.headers.map((header: string, index: number) => (
                <th key={index} className="text-left px-3 py-2 text-gray-700 font-semibold text-xs">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 text-gray-800 text-xs">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLog = () => {
    const { data, interactive } = visualization;
    
    const allUsers = Array.from(new Set(data.entries.map((e: any) => e.user))) as string[];
    const allActions = Array.from(new Set(data.entries.map((e: any) => e.action.split(':')[0].trim()))) as string[];
    
    const toggleUser = (user: string) => {
      setLogFilters(prev => ({
        ...prev,
        users: prev.users.includes(user)
          ? prev.users.filter(u => u !== user)
          : [...prev.users, user]
      }));
    };
    
    const toggleAction = (action: string) => {
      setLogFilters(prev => ({
        ...prev,
        actions: prev.actions.includes(action)
          ? prev.actions.filter(a => a !== action)
          : [...prev.actions, action]
      }));
    };
    
    const filteredEntries = data.entries.filter((entry: any) => {
      if (logFilters.users.length > 0 && !logFilters.users.includes(entry.user)) return false;
      
      const entryAction = entry.action.split(':')[0].trim();
      if (logFilters.actions.length > 0 && !logFilters.actions.includes(entryAction)) return false;
      
      return true;
    });
    
    return (
      <div className="space-y-3">
        {interactive && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filter Logs</span>
            </div>
            
            <div>
              <p className="text-xs text-gray-600 mb-2">Filter by User:</p>
              <div className="flex flex-wrap gap-2">
                {allUsers.map((user: string) => (
                  <button
                    key={user}
                    onClick={() => toggleUser(user)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      logFilters.users.includes(user)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {user}
                  </button>
                ))}
                {logFilters.users.length > 0 && (
                  <button
                    onClick={() => setLogFilters(prev => ({ ...prev, users: [] }))}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600 mb-2">Filter by Action:</p>
              <div className="flex flex-wrap gap-2">
                {allActions.map((action: string) => (
                  <button
                    key={action}
                    onClick={() => toggleAction(action)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      logFilters.actions.includes(action)
                        ? 'bg-green-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
                    }`}
                  >
                    {action}
                  </button>
                ))}
                {logFilters.actions.length > 0 && (
                  <button
                    onClick={() => setLogFilters(prev => ({ ...prev, actions: [] }))}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
              Showing {filteredEntries.length} of {data.entries.length} entries
            </div>
          </div>
        )}
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredEntries.map((entry: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-500 font-semibold">{entry.time}</span>
                <span className="text-blue-600 font-medium">{entry.user}</span>
                <span className="text-gray-700">{entry.action}</span>
                {entry.ip && <span className="text-purple-600">{entry.ip}</span>}
              </div>
            </motion.div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No entries match your filters
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBar = () => {
    const { data } = visualization;
    const chartData = data.labels.map((label: string, index: number) => {
      const point: any = { name: label };
      data.datasets.forEach((dataset: any) => {
        point[dataset.label] = dataset.data[index];
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#111827',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {data.datasets.map((dataset: any, index: number) => (
            <Bar
              key={index}
              dataKey={dataset.label}
              fill={dataset.color}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTimeline = () => {
    const { data } = visualization;
    
    return (
      <div className="space-y-4">
        <div className="relative">
          {data.events.map((event: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 mb-4 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'enter' ? 'bg-green-500' : 
                  event.type === 'exit' ? 'bg-red-500' : 
                  event.type === 'activity' ? 'bg-blue-500' : 
                  'bg-yellow-500'
                } border-2 border-white shadow`} />
                {index < data.events.length - 1 && (
                  <div className="w-0.5 h-full min-h-[40px] bg-gray-300 mt-1" />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{event.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      event.type === 'enter' ? 'bg-green-100 text-green-700' :
                      event.type === 'exit' ? 'bg-red-100 text-red-700' :
                      event.type === 'activity' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.type === 'enter' ? 'Entered' :
                       event.type === 'exit' ? 'Left' :
                       event.type === 'activity' ? 'Activity' :
                       'Event'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{event.person}</p>
                  <p className="text-xs text-gray-600">{event.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderIPMatching = () => {
    const { data } = visualization;
    
    return (
      <IPMatchingPuzzle 
        data={data} 
        onComplete={() => setPuzzleCompleted(true)}
      />
    );
  };

  const renderWinRatePrediction = () => {
    const { data } = visualization;
    
    return (
      <WinRatePrediction
        targetValue={data.targetValue}
        tolerance={data.tolerance}
        onComplete={(correct) => {
          setPuzzleCompleted(true);
          if (data.onComplete) data.onComplete(correct);
        }}
      />
    );
  };

  const getIcon = () => {
    switch (visualization.type) {
      case "chart":
        return <BarChart3 className="w-4 h-4" />;
      case "bar":
        return <BarChart3 className="w-4 h-4" />;
      case "table":
        return <Table2 className="w-4 h-4" />;
      case "log":
        return <FileText className="w-4 h-4" />;
      case "timeline":
        return <Clock className="w-4 h-4" />;
      case "ip-matching":
        return <Network className="w-4 h-4" />;
      case "winrate-prediction":
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 my-3 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        {getIcon()}
        <h3 className="font-semibold text-sm">{visualization.title}</h3>
      </div>
      
      <div className="bg-white rounded-lg">
        {visualization.type === "chart" && renderChart()}
        {visualization.type === "bar" && renderBar()}
        {visualization.type === "table" && renderTable()}
        {visualization.type === "log" && renderLog()}
        {visualization.type === "timeline" && renderTimeline()}
        {visualization.type === "ip-matching" && renderIPMatching()}
        {visualization.type === "winrate-prediction" && renderWinRatePrediction()}
      </div>
    </motion.div>
  );
}
