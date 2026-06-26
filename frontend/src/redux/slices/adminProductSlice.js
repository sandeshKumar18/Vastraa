import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Admin Product Actions and Reducer
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// 1. Fetch Admin Products 
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 2. Create a New Product 
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/admin/products`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 3. Update an Existing Product 
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/admin/products/${id}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 4. Delete a Product 
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/admin/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin Product Slice Definition 
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Products Cases
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create Product Cases
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            // Update Product Cases
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (p) => p._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            // Delete Product Cases
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (p) => p._id !== action.payload
                );
            });
    },
});

export default adminProductSlice.reducer;