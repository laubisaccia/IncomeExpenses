import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

//initial state
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//Action creator - createAsyncThunk

//register
export const registerUserAction = createAsyncThunk(
  "user/register",
  async (
    { fullname, email, password },
    { rejectWithValue },
    getState,
    dispatch
  ) => {
    try {
      //header
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const res = await axios.post(
        `${baseURL}/users/register`,
        {
          fullname,
          email,
          password,
        },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//login
export const loginUserAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }, getState, dispatch) => {
    try {
      //header
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const res = await axios.post(
        `${baseURL}/users/login`,
        {
          email,
          password,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      return res.data;
      //save user into local storage
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//logout
export const logoutUserAction = createAsyncThunk("user/logout", async () => {
  //remove user from localstorage
  localStorage.removeItem("userInfo");
  return null;
});
//get profile
export const getProfileAction = createAsyncThunk(
  "user/getProfile",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      //get token
      //pass the token to header
      const config = { headers: { Authorization: `Bearer ${token}` } };
      //make request
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
//users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  //reducers,
  extraReducers: (builder) => {
    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth.userInfo = action.payload;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.userAuth.error = action.payload;
    });
    //login
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth.userInfo = action.payload;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false;
      state.userAuth.error = action.payload;
    });
    //logout
    builder.addCase(logoutUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth.userInfo = null;
    });
    //profile
    builder.addCase(getProfileAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profile = "";
    });
  },
});

//generate reducer
const usersReducers = usersSlice.reducer;

export default usersReducers;
