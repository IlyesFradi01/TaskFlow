import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../../services/api";


// GET TASKS
export const fetchTasks = createAsyncThunk(
    "tasks/fetch",

    async (projectId, thunkAPI) => {
        try {
            const { data } = await api.get("/api/tasks", {
                params: projectId ? { projectId } : {}
            });

            return data.tasks;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not load tasks"
            );
        }
    }
);


// CREATE TASK
export const createTask = createAsyncThunk(
    "tasks/create",

    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/api/tasks", payload);

            return data.task;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not create task"
            );
        }
    }
);


// UPDATE TASK
export const updateTask = createAsyncThunk(
    "tasks/update",

    async ({ id, changes }, thunkAPI) => {
        try {
            const { data } = await api.put(
                `/api/tasks/${id}`,
                changes
            );

            return data.task;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not update task"
            );
        }
    }
);


// DELETE TASK
export const deleteTask = createAsyncThunk(
    "tasks/delete",

    async (id, thunkAPI) => {
        try {
            await api.delete(`/tasks/${id}`);

            return id;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not delete task"
            );
        }
    }
);


// SLICE
const tasksSlice = createSlice({
    name: "tasks",

    initialState: {
        items: [],
        loading: false,
        error: null
    },

    reducers: {
        clearTaskError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        builder

            // FETCH
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // CREATE
            .addCase(createTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(createTask.rejected, (state, action) => {
                state.error = action.payload;
            })


            // UPDATE
            .addCase(updateTask.fulfilled, (state, action) => {
                state.items = state.items.map((task) =>
                    task._id === action.payload._id
                        ? action.payload
                        : task
                );
            })

            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload;
            })


            // DELETE
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (task) => task._id !== action.payload
                );
            })

            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const {
    clearTaskError
} = tasksSlice.actions;

export default tasksSlice.reducer;