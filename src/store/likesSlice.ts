import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface LikesState {
  likedProductIds: number[]
}

const initialState: LikesState = {
  likedProductIds: [],
}

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.likedProductIds.indexOf(id)
      if (index > -1) {
        state.likedProductIds.splice(index, 1)
      } else {
        state.likedProductIds.push(id)
      }
    },
    addLike: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (!state.likedProductIds.includes(id)) {
        state.likedProductIds.push(id)
      }
    },
    removeLike: (state, action: PayloadAction<number>) => {
      const id = action.payload
      state.likedProductIds = state.likedProductIds.filter(
        (likedId) => likedId !== id,
      )
    },
    setLikes: (state, action: PayloadAction<number[]>) => {
      state.likedProductIds = action.payload
    },
    clearLikes: (state) => {
      state.likedProductIds = []
    },
  },
})

export const { toggleLike, addLike, removeLike, setLikes, clearLikes } =
  likesSlice.actions
export default likesSlice.reducer
