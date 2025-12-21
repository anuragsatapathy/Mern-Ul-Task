import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import api from "../api/api";
import Navbar from "../components/Navbar";

const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/dashboard").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return null;

  return (
    <>
      <Navbar />

      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Typography variant="h4" mb={3}>
          Dashboard
        </Typography>

        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography>Total Spent (This Month)</Typography>
            <Typography variant="h6">
              ₹ {data.totalSpending}
            </Typography>
          </Paper>
        </Box>

        {/* CATEGORY CHART */}
        <Typography variant="h6" mt={4}>
          Category-wise Spending
        </Typography>

        <PieChart width={400} height={300}>
          <Pie
            data={data.categoryWise}
            dataKey="total"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.categoryWise.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        
        <Typography variant="h6" mt={4}>
          Recent Expenses
        </Typography>

        {data.recentExpenses.map((e) => (
          <Paper key={e._id} sx={{ p: 2, mt: 1 }}>
            ₹{e.amount} – {e.category}
          </Paper>
        ))}
      </Box>
    </>
  );
}
