import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Add to Cart from local storage

const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem("cart");
        return serializedCart ? JSON.parse(serializedCart) : [];
    } catch (error) {
        console.error("Error loading cart from local storage:", error);
        return [];
    }
};

//save cart to local storage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

    //fetch cart for a use or guest
    export const fetchCart = createAsyncThunk(
        "cart/fetchCart",
        async ({userId,guestId},{rejectWithValue}) => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/cart?userId=${userId}&guestId=${guestId}`
                );
                return response.data;
            } catch (error) {
                return rejectWithValue(error.response.data);
            }   
        }
    );

    // Add an item to the cart for a user or guest
    export const addToCart = createAsyncThunk(
        "cart/addToCart",
        async ({ userId, guestId, productId, quantity,size,color }, { rejectWithValue }) => {
            try {                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                    { userId, guestId, productId, quantity,size,color },
                    
                );
                return response.data;
            }
                catch (error) {
                    return rejectWithValue(error.response.data);
                }
        }
    );
// update the quntitiy of an item in the cart
export const updateCartItem = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId, quantity ,guestId,userId,size,color}, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                { productId, quantity ,guestId,userId,size,color},
               
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }       
);
// remove an item from the cart
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId,guestId,userId,size,color }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                { data: { productId, guestId, userId, size, color } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Merge guest cart into user cart

export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                { guestId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
                
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromLocalStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        },
        clearCartError: (state) => {
            state.error = null;
        },
    },
   extraReducers: (builder) => {
        builder
            // Fetch Cart Cases
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(state.cart);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch cart";
            })

            // Add to Cart Cases
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(state.cart);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })

            // Update Cart Item Quantity Cases 
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(state.cart);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity";
            })

            // Remove from Cart Cases 
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(state.cart);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            })

            // Merge Cart Cases 
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(state.cart);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            });
    },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;