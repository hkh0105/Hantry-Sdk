export async function sendError(error, dsn) {
  const API = "http://localhost:8000/users";

  try {
    const postErrorResoponse = await fetch(`${API}/project/${dsn}/error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: error,
    });

    const response = await postErrorResoponse.json();
  } catch (err) {
    console.log(err);
  }
}
