import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const initialState: RegisterState = {
    loading: false,
    success: false,
    error: null,
};

// Async thunk for user registration
export const register = createAsyncThunk<
    void,
    RegisterPayload,
    { rejectValue: RejectedValue }
>(
    'http://localhost:5000/api/register',
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload);
        } catch (error) {
            return rejectWithValue(error as RejectedValue);
        }
    }
);

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(register.rejected, (state, action: PayloadAction<RejectedValue>) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export default registerSlice.reducer;