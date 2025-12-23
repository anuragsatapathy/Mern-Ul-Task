import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import api from "../api/api";
import MainLayout from "../components/MainLayout";

const COLORS = ["#2563eb", "#9333ea", "#f59e0b", "#16a34a"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/dashboard").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return null;

  return (
    <MainLayout>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Dashboard
      </Typography>

      {/* Total Spent */}
      <Paper
        sx={{
          p: 3,
          pl: 4,      
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography color="text.secondary">
          Total Spent (This Month)
        </Typography>
        <Typography variant="h5" fontWeight={600} mt={1}>
          ₹ {data.totalSpending}
        </Typography>
      </Paper>

      {/* Category wise */}
      <Paper
        sx={{
          p: 4,
          pl: 4,      
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="h6" mb={3}>
          Category-wise Spending
        </Typography>

        <Box display="flex" justifyContent="center">
          <PieChart width={380} height={250}>
            <Pie
              data={data.categoryWise}
              dataKey="total"
              nameKey="_id"
              outerRadius={100}
            >
              {data.categoryWise.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
      </Paper>

      {/* Recent expenses */}
      <Typography variant="h6" mb={2}>
        Recent Expenses
      </Typography>

      {data.recentExpenses.map((e) => (
        <Paper
          key={e._id}
          sx={{
            p: 2.5,
            pl: 4,    
            mb: 2,
            borderRadius: 2,
          }}
        >
          ₹ {e.amount} – {e.category}
        </Paper>
      ))}
    </MainLayout>
  );
}
