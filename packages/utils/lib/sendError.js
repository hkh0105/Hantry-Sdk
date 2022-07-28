export async function sendError(error, dsn) {
  const API = "https://hantry.click/users";
  const url = `${API}/project/${dsn}/error`;
  const option = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: error,
    }),
  };

  try {
    const postErrorResoponse = await fetch.post(url, option);
  } catch (err) {
    console.log(err);
  }
}
