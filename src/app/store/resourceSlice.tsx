import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Comment {
  user: string;
  text: string;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  attachment?: string;
  courseCode: string;
  status: "pending" | "approved" | "rejected";
  instructorId: number;
  reviewerId: number | null;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

interface ResourceState {
  resources: Resource[];
}

const API_URL = "http://localhost:5000/resources";

// Async actions
export const fetchResources = createAsyncThunk("resources/fetchResources", async () => {
  const response = await axios.get<Resource[]>(API_URL);
   console.log("Resource response: ", response.data);
  
  return response.data;
});

export const addResource = createAsyncThunk("resources/addResource", async (newResource: Omit<Resource, "id">) => {
  const response = await axios.post<Resource>(API_URL, newResource);
  return response.data;
});

export const approveResource = createAsyncThunk("resources/approveResource", async (id: number) => {
  const response = await axios.patch(`${API_URL}/${id}`, { status: "approved" });
  return response.data;
});

export const assignReviewer = createAsyncThunk(
  "resources/assignReviewer",
  async ({ resourceId, reviewerId }: { resourceId: number; reviewerId: number }) => {
    const response = await axios.patch(`${API_URL}/${resourceId}`, { reviewerId });
    return response.data;
  }
);

export const reviewResource = createAsyncThunk(
  "resources/reviewResource",
  async ({ resourceId, status }: { resourceId: number; status: "approved" | "rejected" }) => {
    const response = await axios.patch(`${API_URL}/${resourceId}`, { status });
    return response.data;
  }
);

export const resourceSlice = createSlice({
  name: "resources",
  initialState: { resources: [] } as ResourceState,
  reducers: {
    likeResource: (state, action: PayloadAction<number>) => {
      const resource = state.resources.find((r) => r.id === action.payload);
      if (resource) resource.likes += 1;
    },
    dislikeResource: (state, action: PayloadAction<number>) => {
      const resource = state.resources.find((r) => r.id === action.payload);
      if (resource) resource.dislikes += 1;
    },
    addComment: (state, action: PayloadAction<{ id: number; comment: Comment }>) => {
      const resource = state.resources.find((r) => r.id === action.payload.id);
      if (resource) resource.comments.push(action.payload.comment);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      state.resources = action.payload;
    });
    builder.addCase(reviewResource.fulfilled, (state, action) => {
      const index = state.resources.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.resources[index] = action.payload;
    });

    builder.addCase(addResource.fulfilled, (state, action) => {
      state.resources.push(action.payload);
    })
    builder.addCase(approveResource.fulfilled, (state, action) => {
      const index = state.resources.findIndex((res) => res.id === action.payload.id);
      if (index !== -1) state.resources[index] = action.payload;
    });
  },
  
});

export const { likeResource, dislikeResource, addComment } = resourceSlice.actions;
export default resourceSlice.reducer;
