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
  const MAX_POINTS = 15;

  const prepareData = () => {
    if (!elevationData || elevationData.length === 0) {
      return [
        { distance: 0, elevation: 10, battery: 100 },
        { distance: 20, elevation: 35, battery: 92 },
        { distance: 40, elevation: 60, battery: 85 },
        { distance: 60, elevation: 45, battery: 78 },
      ];
    }

    // If we have fewer or equal points than MAX_POINTS → use all
    if (elevationData.length <= MAX_POINTS) {
      return elevationData.map((point) => ({
        distance: Math.round(point.x_km),
        // Use real elevation if available, otherwise simple fallback
        elevation: Math.round(
          point.elevation ?? 20 + point.soc * 0.6 + (point.x_km % 80) * 0.3,
        ),
        battery: Math.max(0, Math.min(100, Math.round(point.soc * 10) / 10)),
      }));
    }

    // Downsample to MAX_POINTS while trying to preserve overall shape
    const step = Math.floor(elevationData.length / (MAX_POINTS - 1));
    const sampled = [];

    for (let i = 0; i < MAX_POINTS - 1; i++) {
      const idx = i * step;
      const point = elevationData[idx];
      sampled.push({
        distance: Math.round(point.x_km),
        elevation: Math.round(
          point.elevation ?? 20 + point.soc * 0.6 + (point.x_km % 80) * 0.3,
        ),
        battery: Math.max(0, Math.min(100, Math.round(point.soc * 10) / 10)),
      });
    }

    // Always include the very last point
    const last = elevationData[elevationData.length - 1];
    sampled.push({
      distance: Math.round(last.x_km),
      elevation: Math.round(
        last.elevation ?? 20 + last.soc * 0.6 + (last.x_km % 80) * 0.3,
      ),
      battery: Math.max(0, Math.min(100, Math.round(last.soc * 10) / 10)),
    });

    return sampled;
  };

  const data = prepareData();
  const isDownsampled = elevationData?.length > MAX_POINTS;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-xl border border-gray-200 shadow-xl min-w-60 text-sm">
        <div className="font-bold text-gray-900 mb-2.5">{label} km</div>
        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
          <span className="text-blue-600 font-medium">↑</span>
          <span className="text-gray-800">
            Elevation: <strong>{payload[0]?.value} m</strong>
          </span>

          <span className="text-green-600 font-medium">Battery</span>
          <span className="text-gray-800">
            <strong>{payload[1]?.value}%</strong>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Energy Profile & Elevation
        </h2>
        <p className="text-gray-600 mt-3">
          Projected battery consumption vs route elevation
        </p>
      </div>

      <div className="w-full" style={{ height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 35, left: 10, bottom: 45 }}
          >
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(41,128,185,0.38)" />
                <stop offset="100%" stopColor="rgba(41,128,185,0)" />
              </linearGradient>
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(39,174,96,0.32)" />
                <stop offset="100%" stopColor="rgba(39,174,96,0)" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="distance"
              label={{
                value: "Distance (km)",
                position: "insideBottom",
                offset: -5,
                dy: 20,
                fontSize: 13,
              }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: "#27ae60", fontSize: 12 }}
              label={{
                value: "Battery %",
                angle: -90,
                position: "insideLeft",
                fill: "#27ae60",
                offset: 0,
                dy: -10,
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "dataMax + 40"]}
              tick={{ fill: "#2980b9", fontSize: 12 }}
              label={{
                value: "Elevation (m)",
                angle: 90,
                position: "insideRight",
                fill: "#2980b9",
                offset: 0,
                dy: -15,
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="elevation"
              name="Elevation"
              stroke="#2980b9"
              strokeWidth={2.8}
              fill="url(#elevationGrad)"
              activeDot={{ r: 9, strokeWidth: 2.5 }}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="battery"
              name="Battery"
              stroke="#27ae60"
              strokeWidth={2.8}
              fill="url(#batteryGrad)"
              activeDot={{ r: 9, strokeWidth: 2.5 }}
            />

            <Legend
              verticalAlign="top"
              height={45}
              iconType="plainline"
              iconSize={16}
              wrapperStyle={{ fontSize: 13, color: "#4b5563", paddingTop: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
