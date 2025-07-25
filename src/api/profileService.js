// ✅ Mock API - Replace with actual backend endpoints later
const API_BASE_URL = "http://localhost:5000/api"; // Replace with your real URL

export async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return null;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return null;
  }
}
