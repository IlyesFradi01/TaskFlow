import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../../services/api";


// GET PROJECTS
export const fetchProjects = createAsyncThunk(
    "projects/fetch",

    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/projects");

            return data.projects;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not load projects"
            );
        }
    }
);


// CREATE PROJECT
export const createProject = createAsyncThunk(
    "projects/create",

    async (payload, thunkAPI) => {
        try {
            const { data } = await api.post("/projects", payload);

            return data.project;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not create project"
            );
        }
    }
);


// UPDATE PROJECT
export const updateProject = createAsyncThunk(
    "projects/update",

    async ({ id, changes }, thunkAPI) => {
        try {
            const { data } = await api.put(
                `/projects/${id}`,
                changes
            );

            return data.project;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not update project"
            );
        }
    }
);


// DELETE PROJECT
export const deleteProject = createAsyncThunk(
    "projects/delete",

    async (id, thunkAPI) => {
        try {
            await api.delete(`/projects/${id}`);

            return id;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Could not delete project"
            );
        }
    }
);


// SLICE
const projectsSlice = createSlice({
    name: "projects",

    initialState: {
        items: [],
        loading: false,
        error: null
    },

    reducers: {
        clearProjectError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        builder

            // FETCH
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // CREATE
            .addCase(createProject.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(createProject.rejected, (state, action) => {
                state.error = action.payload;
            })


            // UPDATE
            .addCase(updateProject.fulfilled, (state, action) => {
                state.items = state.items.map((project) =>
                    project._id === action.payload._id
                        ? action.payload
                        : project
                );
            })

            .addCase(updateProject.rejected, (state, action) => {
                state.error = action.payload;
            })


            // DELETE
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (project) => project._id !== action.payload
                );
            })

            .addCase(deleteProject.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const {
    clearProjectError
} = projectsSlice.actions;

export default projectsSlice.reducer;