export async function sendError(error, dsn) {
  console.log(error, dsn);
  const API = "http://localhost:8000/users";
  console.log(API);
  return await fetch(`${API}/project/${dsn}/error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "error",
  });
}
