import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchApi } from "../fetch";



export const fetchSimple=createAsyncThunk(
    'hello/fetchHello',async(data,thunkApi)=>{
        try{
            return await fetchApi(data.url, 'GET', data.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.message);
        }
    });


const simpleSlice=createSlice({
    name:'hello',
    initialState:{
        message:'',
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchSimple.pending,(state,action)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchSimple.fulfilled,(state,action)=>{
            state.loading=false;
            console.log(action.payload.message);
            state.message=action.payload.message;
        })
        .addCase(fetchSimple.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})

export default simpleSlice.reducer;