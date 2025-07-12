import axios from "axios";
import type { ReviewInterface } from "../interface/IReview";

const apiUrl = "http://localhost:8000";
const headers = {
  "Content-Type": "application/json",
};

// ดึงรีวิวทั้งหมด
export const listReviews = async (): Promise<ReviewInterface[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/reviews`, { headers });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
};

// ดึงรีวิวของ user ตาม user_id
export const getReviewsByUser = async (
  userId: number | string
): Promise<ReviewInterface[] | null> => {
  try {
    const response = await axios.get(
      `${apiUrl}/reviews-by-user/${userId}`,
      { headers }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user's reviews:", error);
    return null;
  }
};

// สร้างรีวิวใหม่
export const createReview = async (
  data: ReviewInterface
): Promise<ReviewInterface | null> => {
  try {
    const response = await axios.post(`${apiUrl}/create-reviews`, data, { headers });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    return null;
  }
};

// อัปเดตรีวิว (PATCH)
export const updateReview = async (
  id: number | string,
  data: Partial<ReviewInterface>
): Promise<ReviewInterface | null> => {
  try {
    const response = await axios.patch(
      `${apiUrl}/update-patch-reviews/${id}`,
      data,
      { headers }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error updating review (PATCH):", error);
    return null;
  }
};

// ลบรีวิว
export const deleteReview = async (
  id: number | string
): Promise<boolean> => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-reviews/${id}`, { headers });
    if (response.status === 200) {
      return true;
    } else {
      console.error("Unexpected status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
};
