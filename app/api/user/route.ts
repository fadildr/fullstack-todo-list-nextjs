import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page and limit must be greater than 0" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: offset,
      take: limit,
    });

    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      {
        status: 200,
        data: users,
        totalUsers,
        totalPages,
        currentPage: page,
        message: "Users fetched successfully",
        error: false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET request:", error);

    return NextResponse.json(
      {
        status: error.code || 500,
        message: error.message || "An unexpected error occurred",
        error: true,
      },
      { status: error.code || 500 }
    );
  }
}
