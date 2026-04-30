export type Service = {
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// 🔥 GET services nga backend
export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch("http://localhost:5000/api/services");

    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}