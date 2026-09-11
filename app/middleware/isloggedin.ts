import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function IsLoggedIn() {

  // GET COOKIE
  const cookieStore =await  cookies();

  const token =  cookieStore.get("token")?.value;

  console.log("TOKEN:", token);

  // NO TOKEN
  if (!token) {
    throw new Error("No token provided");
  }

  try {

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    console.log("DECODED:", decoded);

    return decoded;

  } catch (error) {

    throw new Error("Invalid token");
  }
}