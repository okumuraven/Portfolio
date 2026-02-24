import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTimeline,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
} from '../../api/timeline.api';

// Async thunks
const loadTimeline = createAsyncThunk('timeline/loadTimeline', async (params) => {
  return await fetchTimeline(params);
});
const addTimelineEvent = createAsyncThunk('timeline/addTimelineEvent', async (payload) => {
  return await createTimelineEvent(payload);
});
const editTimelineEvent = createAsyncThunk('timeline/editTimelineEvent', async ({ id, ...payload }) => {
  return await updateTimelineEvent(id, payload);
});
const removeTimelineEvent = createAsyncThunk('timeline/removeTimelineEvent', async (id) => {
  return await deleteTimelineEvent(id);
});

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load
      .addCase(loadTimeline.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTimeline.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
      })
      .addCase(loadTimeline.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create
      .addCase(addTimelineEvent.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update
      .addCase(editTimelineEvent.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.items = state.items.map(ev => ev.id === updated.id ? updated : ev);
      })
      // Delete
      .addCase(removeTimelineEvent.fulfilled, (state, action) => {
        const removedId = action.meta.arg;
        state.items = state.items.filter(ev => ev.id !== removedId);
      });
  },
});

// Only export here ONCE:
// ...the rest of your slice above...

export {
  loadTimeline,
  addTimelineEvent,
  editTimelineEvent,
  removeTimelineEvent
};