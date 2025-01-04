import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_JWT_SECRET_KEY";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authorization.split(" ")[1];
    const user = jwt.verify(token, JWT_SECRET_KEY);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
