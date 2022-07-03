export async function sendError(dns, error) {
  const API = "http://localhost:8000/users";
  console.log(dns, "error send:", error);
  return await fetch(`${API}/project/${dns}/error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: error,
  });
}
