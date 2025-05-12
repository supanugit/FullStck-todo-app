"use client";
import axios from "axios";
import { PlusCircle, CircleX } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: user, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [task, setTask] = useState("");
  const [finished, setFinished] = useState(false);
  const [tasks, setTasks] = useState<{ task: string; finished: boolean }[]>([]);
  const [deleteVisible, setDeleteVisible] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!user?.user?.email) return console.log("email not found");

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_FETCH_URL}/api/?email=${user?.user?.email}`
        );
        setTasks(res.data.user?.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [status, user]);

  const handleClick = () => {
    user ? setVisible(!visible) : signIn();
  };

  const handleAdd = async () => {
    if (!task) {
      return;
    }
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_FETCH_URL}/api`, {
        email: user?.user?.email,
        task,
        finished,
      });

      if (res.status === 200) {
        setTasks(res.data.user.tasks);
        setTask("");
        setFinished(false);
        setVisible(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleLongPressStart = (i: number) => {
    const timer = setTimeout(() => {
      setDeleteVisible(i);
    }, 500);

    const handlePointerUp = () => {
      clearTimeout(timer);
    };

    window.addEventListener("pointerup", handlePointerUp, { once: true });
  };

  const handleDelete = async (i: number) => {
    if (!user?.user?.email) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/api`,
        {
          data: {
            email: user.user.email,
            id: i,
          },
        }
      );

      if (res.status === 200) {
        setTasks(res.data.tasks);
        setDeleteVisible(null);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleFinished = async (i: number) => {
    if (!user?.user?.email) return;

    try {
      const updatedTasks = tasks.map((task, index) =>
        index === i ? { ...task, finished: !task.finished } : task
      );

      const res = await axios.put(`${process.env.NEXT_PUBLIC_FETCH_URL}/api`, {
        email: user.user.email,
        id: i,
        task: updatedTasks[i].task,
        finished: updatedTasks[i].finished,
      });

      if (res.status === 200) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start pt-20 bg-gray-100">
      <button
        onClick={handleClick}
        className="absolute top-5 right-15 md:right-30 flex items-center gap-2 bg-white text-indigo-600 px-2 py-1 rounded-full font-medium hover:bg-indigo-100 transition">
        {visible ? (
          <CircleX className="w-3.5 h-3.5 md:w-5 md:h-5" />
        ) : (
          <PlusCircle className="w-3.5 h-3.5 md:w-5 md:h-5" />
        )}
        {visible ? "Close Task Bar" : "Add Task"}
      </button>

      {visible && (
        <div className="w-96 p-6 relative flex flex-col gap-4 items-center justify-center bg-white rounded-lg shadow-md border">
          <button
            onClick={() => {
              setVisible(false);
              setFinished(false);
              setTask("");
            }}
            className="absolute top-2 right-2 text-red-700 text-xl font-bold hover:text-red-500 transition">
            ✕
          </button>

          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <label className="flex items-center gap-2">
            <span>Finished?</span>
            <input
              type="checkbox"
              checked={finished}
              onChange={() => setFinished(!finished)}
              className="accent-indigo-600"
            />
          </label>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Add
          </button>
        </div>
      )}

      <div className="mt-6 w-96 flex flex-col gap-3">
        {tasks.map((e, i) => (
          <div
            key={i}
            className="task-container flex items-center justify-between bg-white px-4 py-2 rounded-md shadow-sm border hover:bg-indigo-50 transition relative"
            onPointerDown={() => handleLongPressStart(i)}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={e.finished}
                onChange={() => handleToggleFinished(i)}
                className="accent-indigo-600"
              />
              <span
                className={`text-lg ${
                  e.finished ? "line-through text-gray-400" : "text-gray-800"
                }`}>
                {e.task}
              </span>
            </div>

            {deleteVisible === i && (
              <button
                onClick={() => handleDelete(i)}
                className="absolute top-1 right-1 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
