import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/DB/connectdb"; // Adjust import paths as needed
import { userDB } from "@/app/api/DB/modle/User_model";

export async function GET(req: NextRequest) {
  await connectDB();

  const email = req.nextUrl.searchParams.get("email");
  // const email = req.nextUrl.searchParams.get("email");
  try {
    if (!email) {
      console.log("Email is required");
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    let user = await userDB.findOne({ email });

    if (!user) {
      console.log("User not found");
      user = await userDB.create({ email });
      return NextResponse.json(
        { message: "User created", user },
        { status: 201 }
      );
    }
    console.log("User already exists");
    return NextResponse.json({ message: "User already exists", user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { email, task, finished } = await req.json();

  if (email == null || task == null || finished == null) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const user = await userDB.findOne({ email });
  if (!user) {
    return NextResponse.json({
      message: "User not found",
      status: 404,
    });
  }

  await user.tasks.push({ task: task, finished: finished });
  await user.save();
  return NextResponse.json({
    message: "User found",
    user,
    status: 200,
  });
}

export async function DELETE(req: NextRequest) {
  const { email, id } = await req.json();
  if (email == null || id == null) {
    return NextResponse.json({
      message: "Missing required fields",
      status: 400,
    });
  }
  await connectDB();
  const user = await userDB.findOne({ email });
  if (!user) {
    return NextResponse.json({
      message: "User not found",
      status: 404,
    });
  }
  user.tasks = user.tasks.filter((_: string, i: number) => {
    return i != id;
  });

  user.save();
  return NextResponse.json({
    message: "Task deleted successfully",
    status: 200,
    tasks: user.tasks,
  });
}

export async function PUT(req: NextRequest) {
  const { email, id, task, finished } = await req.json();
  if (email == null || id == null || task == null || finished == null) {
    return NextResponse.json({
      message: "Missing required fields",
      status: 400,
    });
  }
  await connectDB();
  const user = await userDB.findOne({ email });
  if (!user) {
    return NextResponse.json({
      message: "User not found",
      status: 404,
    });
  }

  user.tasks[id].task = task;
  user.tasks[id].finished = finished;
  user.save();
  return NextResponse.json({
    message: "Task updated successfully",
    status: 200,
    tasks: user.tasks,
  });
}
