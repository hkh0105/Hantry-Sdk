export async function sendError(dns, error) {
  const API = process.env.ERROR_API;

  return await fetch(`${API}/project/${dns}/error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: error,
  });
}
