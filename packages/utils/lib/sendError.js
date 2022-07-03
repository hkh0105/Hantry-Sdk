import axios from "axios";

export async function sendError(error, dsn) {
  const API = "http://localhost:8000/users";

  try {
    const postErrorResoponse = await axios.post(
      `${API}/project/${dsn}/error`,
      error,
    );
  } catch (err) {
    console.log(err);
  }
}
