import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Fetch issues
export const fetchIssues = createAsyncThunk(
  "issues/fetch",
  async () => {
    const res = await api.get("/issues");
    return res.data.data.items;
  }
);

// Update status (admin/tester + developer assigned)
export const updateIssueStatus = createAsyncThunk(
  "issues/updateStatus",
  async ({ id, status }) => {
    const res = await api.put(`/issues/${id}`, { status });
    return res.data.data;
  }
);

export const assignIssue = createAsyncThunk(
  "issues/assign",
  async ({ id, assignedTo }) => {
    const res = await api.patch(`/issues/${id}/assign`, { assignedTo });
    return res.data.data;
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(assignIssue.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default issueSlice.reducer;


