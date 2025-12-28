export async function getDashboardStats() {
  const response = await fetch("http://localhost:5000/events/dashboard");
  return response.json();
}
