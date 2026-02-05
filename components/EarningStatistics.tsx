import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 40 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 108 },
  { month: "May", value: 60 },
  { month: "Jun", value: 110 },
  { month: "Jul", value: 45 },
  { month: "Aug", value: 110 },
];

export default function EarningStatistics() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        width: "100%",
        height: "400px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ fontWeight: 600 }}>Earning Statistics</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              padding: "6px 12px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            Yearly
          </button>

          <select
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
            }}
          >
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 200]} />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#0077b6"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
