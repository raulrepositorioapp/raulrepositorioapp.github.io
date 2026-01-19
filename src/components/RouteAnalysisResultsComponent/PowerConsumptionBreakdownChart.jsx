import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PowerConsumptionBreakdownChart = ({ powerBreakdown }) => {
  const MAX_VISIBLE = 9; // 8 detailed + 1 "Others"

  // Prepare data with "Others" grouping when needed
  const chartData = React.useMemo(() => {
    if (!powerBreakdown?.length) return [];

    if (powerBreakdown.length <= MAX_VISIBLE) {
      return powerBreakdown.map((item) => ({
        segment: item.range,
        "Aerodynamic Drag": item.aero || 0,
        "Rolling Resistance": item.rolling || 0,
        "Elevation/Climbing": item.climb || 0,
      }));
    }

    // More than MAX_VISIBLE → take first (MAX-1) + Others
    const visibleParts = powerBreakdown.slice(0, MAX_VISIBLE - 1);
    const remaining = powerBreakdown.slice(MAX_VISIBLE - 1);

    const others = {
      "Aerodynamic Drag": remaining.reduce(
        (sum, item) => sum + (item.aero || 0),
        0,
      ),
      "Rolling Resistance": remaining.reduce(
        (sum, item) => sum + (item.rolling || 0),
        0,
      ),
      "Elevation/Climbing": remaining.reduce(
        (sum, item) => sum + (item.climb || 0),
        0,
      ),
    };

    return [
      ...visibleParts.map((item) => ({
        segment: item.range,
        "Aerodynamic Drag": item.aero || 0,
        "Rolling Resistance": item.rolling || 0,
        "Elevation/Climbing": item.climb || 0,
      })),
      {
        segment: "Others",
        "Aerodynamic Drag": others["Aerodynamic Drag"],
        "Rolling Resistance": others["Rolling Resistance"],
        "Elevation/Climbing": others["Elevation/Climbing"],
      },
    ];
  }, [powerBreakdown]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Power Consumption Breakdown
        </h2>
        <p className="text-gray-600">
          Energy/power usage by source across route segments
          {powerBreakdown?.length > MAX_VISIBLE &&
            ` (${powerBreakdown.length} segments)`}
        </p>
      </div>

      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
            barCategoryGap="22%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="segment"
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fill: "#4b5563", fontSize: 13 }}
              interval={0}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4b5563", fontSize: 13 }}
              label={{
                value: "Power (kW)",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 14,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ fontWeight: 600, color: "#111827" }}
            />

            <Bar
              dataKey="Aerodynamic Drag"
              stackId="a"
              fill="#d946ef"
              radius={[6, 6, 0, 0]}
              maxBarSize={72}
            />
            <Bar
              dataKey="Rolling Resistance"
              stackId="a"
              fill="#3b82f6"
              radius={0}
              maxBarSize={72}
            />
            <Bar
              dataKey="Elevation/Climbing"
              stackId="a"
              fill="#22c55e"
              radius={[0, 0, 6, 6]}
              maxBarSize={72}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#d946ef] shadow-sm" />
          <span className="text-sm font-medium text-gray-700">
            Aerodynamic Drag
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#3b82f6] shadow-sm" />
          <span className="text-sm font-medium text-gray-700">
            Rolling Resistance
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#22c55e] shadow-sm" />
          <span className="text-sm font-medium text-gray-700">
            Elevation / Climbing
          </span>
        </div>
      </div>
    </div>
  );
};

export default PowerConsumptionBreakdownChart;
