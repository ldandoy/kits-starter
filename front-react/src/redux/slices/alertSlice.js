import { createSlice } from '@reduxjs/toolkit'

const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        error: '',
        success: ''
    },
    reducers: {
        setError: (state, {payload}) => {
            state.error = payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        clear: (state) => {
            state.error = ''
            state.success = ''
        }
    }
})

const {reducer, actions} = alertSlice

export const { 
    setError,
    setSuccess,
    clear
} = actions

export default reducer