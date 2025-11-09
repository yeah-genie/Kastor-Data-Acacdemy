import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DataVisualization as DataVizType } from "@/data/case1-story";
import { BarChart3, Table2, FileText } from "lucide-react";

interface DataVisualizationProps {
  visualization: DataVizType;
}

export function DataVisualization({ visualization }: DataVisualizationProps) {
  const renderChart = () => {
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
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
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
    const { data } = visualization;
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.entries.map((entry: any, index: number) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-500 font-semibold">{entry.time}</span>
              <span className="text-blue-600 font-medium">{entry.user}</span>
              <span className="text-gray-700">{entry.action}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                entry.status === "success" || entry.status.includes("성공") || entry.status.includes("성공") || entry.status === "noted" || entry.status === "normal"
                  ? "bg-green-100 text-green-700" 
                  : entry.status === "failed" || entry.status.includes("실패") || entry.status === "attacked" || entry.status === "emergency" || entry.status === "critical"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {entry.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getIcon = () => {
    switch (visualization.type) {
      case "chart":
        return <BarChart3 className="w-4 h-4" />;
      case "table":
        return <Table2 className="w-4 h-4" />;
      case "log":
        return <FileText className="w-4 h-4" />;
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
        {visualization.type === "table" && renderTable()}
        {visualization.type === "log" && renderLog()}
      </div>
    </motion.div>
  );
}
