import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 윗부분에서는 서버 통신 관련 부분을 작성한다 -> axios 관련 로직 작성(get, post, patch, delete)
// 성공(fulfilled)하든, 실패(rejected)하는 결과값이 나옴
// 그 결과값에 따라서 내부적인 state 업데이트 -> extrReducer 통해서

// 두 가지의 input을 받음
// 1. 이 thunk의 이름(이 비동기 통신-액션의 이름)
// 2. 비동기 통신 로직(async 함수)

export const __getTodosThunk = createAsyncThunk(
    "GET_TODOS",
    async (arg, thunkAPI) => {
        // 비동기 로직 호출 부분 -> await.
        try {
            // 비동기 로직
            const todos = await axios.get("http://localhost:4000/todos");
            // console.log("todos.data", todos.data);
            return thunkAPI.fulfillWithValue(todos.data);
        } catch (error) {
            // 오류 처리 관련 로직
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// 추가
export const __addTodoThunk = createAsyncThunk(
    "ADD_TODO",
    async (arg, thunkAPI) => {
        try {
            const res = await axios.post("http://localhost:4000/todos", arg);

            return thunkAPI.fulfillWithValue(res.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// 삭제
export const __deleteTodoThunk = createAsyncThunk(
    "DELETE_TODO",
    async (arg, thunkAPI) => {
        try {
            const res = await axios.delete(
                `http://localhost:4000/todos/${arg}`
            );
            return thunkAPI.fulfillWithValue(arg);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// 스위치
export const __switchTodoThunk = createAsyncThunk(
    "SWITCH_TODO",
    async (arg, thunkAPI) => {
        try {
            await axios.patch(`http://localhost:4000/todos/${arg.id}`, {
                isDone: arg.isDone,
            });
            return thunkAPI.fulfillWithValue(arg.id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// initial states
const initialState = {
    todos: [],
    isLoading: false,
    isSuccess: false,
    error: null,
};

// createSlice의 결과물 -> action creators와 reducers
const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // addTodo: (state, action) => {
        //     console.log("test");
        //     console.log("action", action.payload);
        //     // return [...state, action.payload];
        //     state.push(action.payload); // 툴킷에서 기본적으로 제공해줌
        // }, // action creator의 이름
        // removeTodo: (state, action) => {
        //     return state.filter((item) => item.id !== action.payload);
        // }, // action creator의 이름
        // switchTodo: (state, action) => {
        //     return state.map((item) => {
        //         if (item.id === action.payload) {
        //             return { ...item, isDone: !item.isDone };
        //         } else {
        //             return item;
        //         }
        //     });
        // }, // action creator의 이름
    },
    extraReducers: {
        [__getTodosThunk.fulfilled]: (state, action) => {
            // state를 업데이트 하는 로직 수행
            // state.isLoading = false;
            // state.isSuccess = true;
            state.todos = action.payload;
        },
        [__getTodosThunk.rejected]: (state, action) => {
            //     // state를 업데이트 하는 로직 수행
            //     state.isLoading = false;
            //     state.isSuccess = false;
            //
        },
        // [__getTodosThunk.pending]: (state, action) => {
        //     // state를 업데이트 하는 로직 수행
        //     state.isLoading = true;
        //     state.isSuccess = false;
        // },

        [__addTodoThunk.fulfilled]: (state, action) => {
            state.todos.push(action.payload);
        },
        [__addTodoThunk.rejected]: (state, action) => {
            //
        },

        [__deleteTodoThunk.fulfilled]: (state, action) => {
            const newTodos = state.todos.filter(
                (item) => item.id !== action.payload
            );
            state.todos = newTodos;
        },
        [__deleteTodoThunk.rejected]: (state, action) => {
            //
        },
        [__switchTodoThunk.fulfilled]: (state, action) => {
            const newTodos = state.todos.map((item) => {
                if (item.id === action.payload) {
                    return { ...item, isDone: !item.isDone };
                } else {
                    return item;
                }
            });
            state.todos = newTodos
        },
        [__switchTodoThunk.rejected]: (state, action) => {
            //
        },
    },
});

export const { removeTodo, switchTodo } = todosSlice.actions; // 액션 객체가 만들어짐
export default todosSlice.reducer;

// 외부적인 reducer = extraReducer : 비동기 관련 로직
