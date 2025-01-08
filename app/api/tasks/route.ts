import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, description, createdById, assignedUserId } =
      await req.json();

    if (!title || !description || !createdById) {
      return NextResponse.json(
        { error: "Title, description, and createdById are required" },
        { status: 400 }
      );
    }

    if (assignedUserId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedUserId },
      });
      if (!assignedUser) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 404 }
        );
      }
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const creator = await prisma.user.findUnique({
      where: { id: createdById },
    });
    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdById,
        assignedUserId,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 200,
        data: task,
        message: "Task created successfully",
        error: false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: true, message: "Duplicate data error" },
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const sortBy = url.searchParams.get("sortBy") || "created_at";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const status = url.searchParams.get("status") || "";
    const createdById = url.searchParams.get("createdById") || "";
    const assignedUserId = url.searchParams.get("assignedUserId") || "";

    const skip = (page - 1) * limit;

    const filters: any = {
      AND: [],
    };

    if (search) {
      filters.AND.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (status && status !== "all") {
      filters.AND.push({ status });
    }

    if (createdById) {
      filters.AND.push({ createdById: parseInt(createdById, 10) });
    }

    if (assignedUserId) {
      filters.AND.push({ assignedUserId: parseInt(assignedUserId, 10) });
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
        activityLogs: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            field: true,
            beforeValue: true,
            afterValue: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    const totalTasks = await prisma.task.count({
      where: filters,
    });

    return NextResponse.json({
      status: 200,
      data: {
        tasks,
        meta: {
          total: totalTasks,
          page,
          limit,
          totalPages: Math.ceil(totalTasks / limit),
        },
      },
    });
  } catch (error: any) {
    console.log("Error in GET tasks:", error);
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

export async function PUT(req: Request) {
  try {
    const { id, title, description, status, assignedUserId, userId } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Cari task yang ada berdasarkan ID
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });
    if (!existingTask) {
      return NextResponse.json(
        { error: `Task with ID ${id} not found` },
        { status: 404 }
      );
    }

    const updatedData: any = {};
    const activityLogs: any[] = [];

    // Menentukan perubahan dan mencatat aktivitas
    if (title && title !== existingTask.title) {
      updatedData.title = title;
      activityLogs.push({
        field: "title",
        beforeValue: existingTask.title,
        afterValue: title,
      });
    }

    if (description && description !== existingTask.description) {
      updatedData.description = description;
      activityLogs.push({
        field: "description",
        beforeValue: existingTask.description,
        afterValue: description,
      });
    }

    if (status && status !== existingTask.status) {
      updatedData.status = status;
      activityLogs.push({
        field: "status",
        beforeValue: existingTask.status,
        afterValue: status,
      });
    }

    if (
      assignedUserId !== undefined &&
      assignedUserId !== existingTask.assignedUserId
    ) {
      updatedData.assignedUserId = assignedUserId;
      activityLogs.push({
        field: "assignedUserId",
        beforeValue: existingTask.assignedUserId,
        afterValue: assignedUserId,
      });
    }

    // Update task di database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updatedData,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Mencatat aktivitas ke ActivityLog
    for (const log of activityLogs) {
      await prisma.activityLog.create({
        data: {
          taskId: id,
          userId: userId, // Misalkan ID user yang melakukan update
          field: log.field,
          beforeValue: log.beforeValue,
          afterValue: log.afterValue,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        status: 200,
        data: updatedTask,
        message: "Task updated successfully",
        error: false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT request:", error);

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
