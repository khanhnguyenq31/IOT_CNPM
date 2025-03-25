import { getTokenFromCookie } from '@/utils/token';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const resetPassword = createAsyncThunk<
    { success: boolean }, // Adjust the return type to match the response structure
    ResetPasswordPayload,
    { rejectValue: RejectedValue }
>(
    'auth/resetPassword',
    async (payload, { rejectWithValue }) => {
        try {
            const token = getTokenFromCookie();
            const response = await fetch('http://localhost:5000/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the Authorization header
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData as RejectedValue);
            }

            return { success: true }; // Example return value, adjust based on your API
        } catch (error) {
            return rejectWithValue("Network error occurred");
        }
    }
);

// Slice for resetPassword
const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(resetPassword.rejected, (state, action: PayloadAction<RejectedValue>) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export default resetPasswordSlice.reducer;
