import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function EnergyProfileElevationChart({ elevationData }) {
  const transformData = () => {
    if (!elevationData || elevationData?.length === 0) {
      return [
        { distance: 0, elevation: 10, battery: 100 },
        { distance: 20, elevation: 35, battery: 92 },
        { distance: 40, elevation: 60, battery: 85 },
        { distance: 60, elevation: 45, battery: 78 },
        { distance: 80, elevation: 25, battery: 70 },
      ];
    }

    return elevationData.map((point) => {
      const distanceInMiles = point.x_km;

      // Assuming soc comes as percentage 0-100
      // Adjust this logic according to your actual SOC format
      const batteryPercentage = Math.max(0, Math.min(100, point.soc));

      // Placeholder elevation - replace with real elevation data when available
      // This is just to prevent completely flat chart
      const elevation = 20 + batteryPercentage * 0.6 + (point.x_km % 100) * 0.4;

      return {
        distance: Math.round(distanceInMiles),
        elevation: Math.round(elevation),
        battery: Math.round(batteryPercentage * 10) / 10, // 1 decimal place
      };
    });
  };

  const data = transformData();

  // Dynamic height
  const baseHeight = 380;
  const extraHeight = data.length <= 8 ? 80 : 0;
  const chartHeight = baseHeight + extraHeight;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    // Special message for very sparse data
    if (data.length <= 6) {
      return (
        <div className="bg-white p-5 border border-gray-300 rounded-xl shadow-xl min-w-60">
          <p className="font-medium text-gray-800 mb-2">Route Overview</p>
          <p className="text-gray-600 text-sm">
            Limited data points available ({data.length})
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="font-medium">Distance: {label} km</p>
            <p style={{ color: "#2980b9" }}>
              Elevation: {payload[0]?.value} ft
            </p>
            <p style={{ color: "#28b463" }}>Battery: {payload[1]?.value}%</p>
          </div>
        </div>
      );
    }

    // Normal detailed tooltip
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-200 shadow-md min-w-[200px] text-sm">
        <div className="font-semibold text-gray-800 mb-2">{label} miles</div>
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5">
          <span className="text-blue-600 font-medium">↑</span>
          <span>Elevation: {payload[0]?.value} ft</span>

          <span className="text-green-600 font-medium">Battery</span>
          <span>{payload[1]?.value}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-2xl border">
      <div>
        <h1 className="title text-black!">Energy Profile & Elevation</h1>
        <p className="paragraph mt-6">
          Projected battery depletion against route topography
        </p>
      </div>

      <div className="w-full my-10" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="elevationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(30,120,255,0.35)" />
                <stop offset="100%" stopColor="rgba(30,120,255,0)" />
              </linearGradient>
              <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(46,204,113,0.25)" />
                <stop offset="100%" stopColor="rgba(46,204,113,0)" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />

            <XAxis
              dataKey="distance"
              label={{
                value: "Distance (km)",
                position: "insideBottom",
                dy: 10,
                fontSize: 12,
              }}
              tick={{ fill: "#7f8c8d", fontSize: 11 }}
              axisLine={false}
            />

            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: "#27ae60", fontSize: 11 }}
              label={{
                value: "Battery %",
                angle: -90,
                position: "insideLeft",
                fill: "#27ae60",
                fontSize: 12,
              }}
              axisLine={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "dataMax + 20"]}
              tick={{ fill: "#2980b9", fontSize: 11 }}
              label={{
                value: "Elevation (meters)",
                angle: 90,
                position: "insideRight",
                fill: "#2980b9",
                fontSize: 12,
              }}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="elevation"
              name="Elevation"
              stroke="rgba(30,120,255,1)"
              strokeWidth={3}
              fill="url(#elevationGradient)"
              activeDot={{ r: data.length <= 10 ? 10 : 6, strokeWidth: 2 }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="battery"
              name="Battery"
              stroke="rgba(40,180,99,1)"
              strokeWidth={3}
              fill="url(#batteryGradient)"
              activeDot={{ r: data.length <= 10 ? 10 : 6, strokeWidth: 2 }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
