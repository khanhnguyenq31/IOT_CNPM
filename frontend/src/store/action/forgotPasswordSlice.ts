import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const initialState: ForgotPasswordState = {
    loading: false,
    success: false,
    error: null,
};

export const forgotPassword = createAsyncThunk<
    void,
    ForgotPasswordPayload,
    { rejectValue: RejectedValue }
>(
    'auth/forgotPassword',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // Convert payload to JSON
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse error response
                return rejectWithValue(errorData as RejectedValue); // Handle error
            }
        } catch (error) {
            return rejectWithValue(error as RejectedValue); // Handle network error
        }
    }
);

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(forgotPassword.rejected, (state, action: PayloadAction<RejectedValue>) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export default forgotPasswordSlice.reducer;