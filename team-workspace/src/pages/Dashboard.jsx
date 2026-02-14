import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import { 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  OutlinedInput,
  InputAdornment 
} from "@mui/material";

import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Container,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  AssignmentOutlined,
  ErrorOutline,
  CheckCircleOutline,
  TrendingUp,
  FiberManualRecord,
  DonutLarge,
  WorkspacesOutlined, // New Icon for dropdown
} from "@mui/icons-material";
import { showError } from "../utils/toast";

/* CHARTS */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  "Completed": "#10b981",
  "In Progress": "#6366f1",
  "To Do": "#f59e0b",
  "Default": "#94a3b8"
};

const BAR_COLOR = "#818cf8";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noWorkspace, setNoWorkspace] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    localStorage.getItem("activeWorkspace") || ""
  );

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (!selectedWorkspace) {
      setNoWorkspace(true);
      setLoading(false);
      return;
    }
    setNoWorkspace(false);
    loadAnalytics(selectedWorkspace);
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      const res = await axios.get("/workspaces");
      const data = res.data.data || [];
      setWorkspaces(data);

      const savedWorkspace = localStorage.getItem("activeWorkspace");
      if (!savedWorkspace && data.length > 0) {
        const latestWorkspace = data[data.length - 1];
        setSelectedWorkspace(latestWorkspace.id);
        localStorage.setItem("activeWorkspace", latestWorkspace.id);
      }
    } catch {
      showError("Failed to load workspaces");
    }
  };

  const loadAnalytics = async (workspaceId) => {
    try {
      setLoading(true);
      const res = await axios.get("/analytics/dashboard", {
        params: { workspaceId },
      });
      setStats(res.data.data || {});
    } catch {
      showError("Failed to load dashboard analytics");
    } finally {
      setLoading(false);
    }
  };

  if (noWorkspace) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#64748b">No workspace selected</Typography>
          <Typography variant="body2" color="#94a3b8">Please open a workspace to view analytics dashboard.</Typography>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress thickness={5} size={60} sx={{ color: "#6366f1" }} />
        </Box>
      </Box>
    );
  }

  const statusData = stats?.tasksByStatus?.map((s) => ({
    name: formatStatus(s.status),
    value: s._count._all,
  })) || [];

  const productivityData = stats?.productivity?.map((p) => ({
    name: p.user?.name || "Unknown",
    tasks: p._count._all,
  })) || [];

  const tableData = (() => {
    if (!stats?.tasksPerUser) return [];
    const map = {};
    stats.tasksPerUser.forEach((t) => {
      if (!map[t.assignedTo]) {
        map[t.assignedTo] = {
          name: t.user?.name || "Unknown",
          DONE: 0,
          TODO: 0,
          IN_PROGRESS: 0,
        };
      }
      map[t.assignedTo][t.status] = t._count._all;
    });
    return Object.values(map);
  })();

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, width: "100%" }}>
        <Container maxWidth="xl">
          
          {/* REFINED HEADER SECTION */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            gap: 2
          }}>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: "#0f172a", mb: 0.5 }}>
                Dashboard Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Real-time workspace activity and team performance.
              </Typography>
            </Box>

            {/* ELEGANT WORKSPACE SELECTOR */}
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <Select
                value={selectedWorkspace}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedWorkspace(id);
                  localStorage.setItem("activeWorkspace", id);
                }}
                displayEmpty
                input={<OutlinedInput 
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkspacesOutlined sx={{ fontSize: 20, color: '#6366f1' }} />
                    </InputAdornment>
                  }
                />}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                    borderWidth: '1.5px'
                  }
                }}
              >
                {workspaces.map((w) => (
                  <MenuItem key={w.id} value={w.id} sx={{ fontSize: '0.875rem', py: 1 }}>
                    {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* TOP OVERVIEW CARDS */}
          <Grid container spacing={2.5} mb={4}>
            <OverviewCard title="Projects" value={stats.projectsCount} color="#6366f1" icon={<AssignmentOutlined fontSize="small" />} />
            <OverviewCard title="Overdue" value={stats.overdueTasks} color="#ef4444" icon={<ErrorOutline fontSize="small" />} />
            {statusData.map((s) => (
              <OverviewCard 
                key={s.name} 
                title={s.name} 
                value={s.value} 
                color={STATUS_COLORS[s.name] || STATUS_COLORS.Default} 
                icon={s.name === "Completed" ? <CheckCircleOutline fontSize="small" /> : <DonutLarge fontSize="small" />}
              />
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* PRODUCTIVITY BAR CHART */}
            <Grid item xs={12} lg={7}>
              <ChartPaper title="User Productivity" icon={<TrendingUp sx={{ color: "#6366f1", fontSize: 20 }} />}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="tasks" fill={BAR_COLOR} radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartPaper>
            </Grid>

            {/* TASK STATUS PIE CHART  */}
            <Grid item xs={12} lg={5}>
              <ChartPaper title="Task Distribution">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      innerRadius="60%"
                      outerRadius="85%"
                      paddingAngle={5}
                      stroke="none"
                      cx="50%"
                      cy="50%"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={STATUS_COLORS[entry.name] || STATUS_COLORS.Default} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartPaper>
            </Grid>

            {/* ACTIVITY TABLE */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", overflow: 'hidden'}}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <FiberManualRecord sx={{ fontSize: 10, color: '#10b981' }} />
                   <Typography variant="subtitle1" fontWeight={700}>Team Activity Summary</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Team Member</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }} align="center">Completed</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }} align="center">In Progress</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }} align="center">To Do</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                     { tableData.map((p, i) => (
                        <TableRow 
                          key={i} 
                          sx={{ 
                            '&:hover': { bgcolor: '#f1f5f9', transition: '0.2s' },
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e7ff', color: '#6366f1', fontSize: '0.85rem', fontWeight: 700 }}>
                                {p.name[0]}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ px: 1.5, py: 0.5, borderRadius: 1, bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }}>
                              Active
                            </Typography>
                          </TableCell>
                        <TableCell align="center">
                        <Typography color="#10b981" fontWeight={700}>
                          {p.DONE || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color="#6366f1" fontWeight={700}>
                          {p.IN_PROGRESS || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color="#f59e0b" fontWeight={700}>
                          {p.TODO || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={800}>
                          {(p.DONE || 0) + (p.IN_PROGRESS || 0) + (p.TODO || 0)}
                        </Typography>
                      </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

/* --- Helper Components stay the same --- */
const ChartPaper = ({ title, icon, children }) => (
  <Paper elevation={0} sx={{ 
    p: 3, borderRadius: 3, border: "1px solid #e2e8f0", height: 400, display: "flex", flexDirection: "column",
    transition: 'transform 0.2s ease-in-out',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.05)' }
  }}>
    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
      {icon}
      <Typography variant="subtitle1" fontWeight={700} color="#1e293b">{title}</Typography>
    </Stack>
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
  </Paper>
);

const OverviewCard = ({ title, value, color, icon }) => (
  <Grid item xs={12} sm={6} md={2.4}>
    <Paper elevation={0} sx={{
        p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: '#fff', transition: '0.2s',
        '&:hover': { borderColor: color, transform: 'scale(1.02)', boxShadow: `0 8px 20px -6px ${color}30` }
      }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: 'flex', p: 1, borderRadius: 1.5, bgcolor: `${color}10`, color }}>{icon}</Box>
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ color: "#94a3b8", textTransform: 'uppercase' }}>{title}</Typography>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#0f172a" }}>{value ?? 0}</Typography>
        </Box>
      </Stack>
    </Paper>
  </Grid>
);

const formatStatus = (status) => {
  const map = { "TODO": "To Do", "IN_PROGRESS": "In Progress", "DONE": "Completed" };
  return map[status] || status;
};

export default Dashboard;