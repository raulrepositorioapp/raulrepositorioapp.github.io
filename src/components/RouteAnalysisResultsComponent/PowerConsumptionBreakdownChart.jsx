import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PowerConsumptionBreakdownChart = ({ powerBreakdown }) => {
  // Chart Data
  const chartData =
    powerBreakdown?.map((item) => ({
      segment: item.range,
      aerodynamicDrag: item.aero,
      rollingResistance: item.rolling,
      elevationClimbing: item.climb,
    })) || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg border">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Power Consumption Breakdown
        </h1>
        <p className="text-gray-600">
          Energy loss by source across route segments.
        </p>
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="segment"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 14 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 14 }}
              // domain={[0, 24]}
              // ticks={[0, 6, 12, 18, 24]}
            />
            <Bar
              dataKey="aerodynamicDrag"
              stackId="a"
              fill="#d946ef"
              radius={[0, 0, 0, 0]}
              barSize={60}
            />
            <Bar
              dataKey="rollingResistance"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="elevationClimbing"
              stackId="a"
              fill="#22c55e"
              radius={[100, 100, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#d946ef]"></div>
          <span className="text-sm text-gray-700">Aerodynamic Drag</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
          <span className="text-sm text-gray-700">Rolling Resistance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
          <span className="text-sm text-gray-700">Elevation/Climbing</span>
        </div>
      </div> */}
    </div>
  );
};

export default PowerConsumptionBreakdownChart;
