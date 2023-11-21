import axios from "axios";
const baseURL = "http://localhost:3003/api/login";

/**
 * The login function sends a POST request to a specified URL with provided credentials and returns the
 * response data.
 * @param creds - The `creds` parameter is an object that contains the login credentials, such as
 * username and password, that will be sent in the request body when making a POST request to the
 * `baseURL`.
 * @returns The data returned from the axios post request.
 */
const login = async (creds) => {
  try {
    const res = await axios.post(baseURL, creds);
    if (res.status === 401) throw new Error("Unauthorized");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default { login };
