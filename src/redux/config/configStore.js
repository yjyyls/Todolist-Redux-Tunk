import todos from "../modules/todos";
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer: {
        todos,
    },
});


export default store;
