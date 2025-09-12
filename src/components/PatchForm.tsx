"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface EditFormProps {
  fileKey: string;
  initialNote?: string;
  initialTitle?: string;
  onSuccess?: (data: any) => void;
}

export default function PatchForm({
  fileKey,
  initialNote = "",
  initialTitle = "",
  onSuccess,
}: EditFormProps) {
  const [note, setNote] = useState(initialNote);
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const patchRes = await fetch("/api/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileKey,
          updates: {
            note,
            title,
          },
        }),
      });

      const dataRes = await patchRes.json();
      setLoading(false);

      if (!patchRes.ok) {
        setError(dataRes.error || "Unknown error");
      } else {
        queryClient.setQueryData(["resources"], (oldData: any) =>
          oldData.map((item: any) =>
            item.key === dataRes.data.key ? { ...item, ...dataRes.data } : item
          )
        );

        onSuccess?.(dataRes.data);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1"
        />
      </label>
      <label>
        Note:
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1"
        />
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "Updating..." : "Update File"}
      </button>
    </form>
  );
}
