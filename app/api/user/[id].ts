import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Invalid user ID",
          error: true,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          message: "User not found",
          error: true,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      data: user,
    });
  } catch (error: any) {
    console.error("Error in GET user details:", error);
    return NextResponse.json(
      {
        status: 500,
        message: error.message || "An unexpected error occurred",
        error: true,
      },
      { status: 500 }
    );
  }
}
