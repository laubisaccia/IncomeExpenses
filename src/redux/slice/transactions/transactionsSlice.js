import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

//initial State
const initialState = {
  transactions: [],
  transaction: {},
  error: null,
  loading: false,
  isAdded: false,
  isUpdated: false,
};

//Action to create transaction

export const createTransactionAction = createAsyncThunk(
  "transaction/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const { account, name, transactionType, amount, notes, category } = payload;
    try {
      //get token from store
      const token = getState()?.users?.userAuth?.userInfo?.token;
      //pass token into header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //make request
      const { data } = await axios.post(
        `${baseURL}/transactions`,
        {
          name,
          transactionType,
          amount,
          notes,
          category,
          account: payload.id,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateTransactionAction = createAsyncThunk(
  "transaction/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const { account, name, transactionType, amount, notes, category, id } =
      payload;
    try {
      //get token from store
      const token = getState()?.users?.userAuth?.userInfo?.token;
      //pass token into header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //make request
      const { data } = await axios.put(
        `${baseURL}/transactions/${id}`,
        {
          account,
          name,
          transactionType,
          amount,
          notes,
          category,
          id,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch one transaction
export const getTransactionAction = createAsyncThunk(
  "transaction/details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      //get token from store
      const token = getState()?.users?.userAuth?.userInfo?.token;
      //pass token into header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //make request
      const { data } = await axios.get(`${baseURL}/transactions/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//create Slice

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    //create transaction
    builder.addCase(createTransactionAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTransactionAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.transaction = action.payload;
    });
    builder.addCase(createTransactionAction.rejected, (state, action) => {
      state.loading = false;
      state.isAdded = false;
      state.transaction = [];
      state.error = action.payload;
    });

    //update transaction
    builder.addCase(updateTransactionAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTransactionAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.transaction = action.payload;
    });
    builder.addCase(updateTransactionAction.rejected, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.transaction = [];
      state.error = action.payload;
    });

    //get single transaction
    builder.addCase(getTransactionAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTransactionAction.fulfilled, (state, action) => {
      state.loading = false;
      state.transaction = action.payload;
    });
    builder.addCase(getTransactionAction.rejected, (state, action) => {
      state.loading = false;
      state.transaction = null;
      state.error = action.payload;
    });
  },
});

//Generate reducer

const transactionsReducer = transactionsSlice.reducer;
export default transactionsReducer;
