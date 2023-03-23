import { createSlice } from "@reduxjs/toolkit";

/*-- initial Redux store value--*/
export const initialState = {
    userData: [],
    getUserDataLoading: false
}

const intrepidSlice = createSlice({
    /*-- store name is intepid --*/
    name: 'intrepid',
    initialState,
    reducers: {
        /*-- Example actions --*/
        getUserDataFetch: (state) => {
            state.getUserDataLoading = true
        },
        getUserDataSuccess: (state, action) => {
            state.userData = action.payload
            state.getUserDataLoading = false
        },
        getUserDataFailure: (state) => {
            state.getUserDataLoading = false
        }
    }

})

export default intrepidSlice;  

