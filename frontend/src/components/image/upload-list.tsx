"use client"

import { useState } from "react"
import { ImagesAPI } from "@/services/api"

type FileEntry = {
  file: File
  title: string
}

export default function UploadList({ onUploaded }: { onUploaded: () => void }) {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [uploading, setUploading] = useState(false)

  const onChangeFiles = (fl: FileList | null) => {
    if (!fl || fl.length === 0) return
    const next: FileEntry[] = Array.from(fl).map((f) => ({
      file: f,
      title: f.name.replace(/\.[^/.]+$/, ""),
    }))
    setFiles((prev) => [...prev, ...next])
  }

  const updateTitle = (idx: number, title: string) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, title } : f)))
  }

  const removeIdx = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const upload = async () => {
    if (files.length === 0) return
    setUploading(true)
    try {
      const form = new FormData()
      files.forEach((f) => {
        form.append("files", f.file)
        form.append("titles", f.title)
      })
      await ImagesAPI.bulkUpload(form)
      setFiles([])
      onUploaded()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Select images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => onChangeFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="rounded border">
          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="grow">
                  <div className="text-xs text-muted-foreground">{f.file.name}</div>
                  <input
                    value={f.title}
                    onChange={(e) => updateTitle(idx, e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    placeholder="Title"
                  />
                </div>
                <button className="rounded border px-2 py-1 text-xs hover:bg-accent" onClick={() => removeIdx(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className="rounded bg-foreground px-4 py-2 text-background disabled:opacity-50"
          disabled={uploading || files.length === 0}
          onClick={upload}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          className="rounded border px-4 py-2 disabled:opacity-50"
          disabled={uploading || files.length === 0}
          onClick={() => setFiles([])}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
