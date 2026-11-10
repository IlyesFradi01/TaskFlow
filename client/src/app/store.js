import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import projectsReducer from "../features/projects/projectsSlice";
import tasksReducer from "../features/tasks/tasksSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectsReducer,
        tasks: tasksReducer
    }
});