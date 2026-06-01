"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";

type PresignedUpload = {
  bucket: string;
  key: string;
  uploadUrl: string;
  expiresIn: number;
};

type Profile = {
  id: string;
  nickname: string;
  avatarBucket: string;
  avatarKey: string;
  avatarUrl: string;
  createdAt: string;
};

type UploadStep =
  | "idle"
  | "requesting-url"
  | "uploading-file"
  | "saving-metadata"
  | "done";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
const maxFileBytes = 5 * 1024 * 1024;

const stepLabel: Record<UploadStep, string> = {
  idle: "เลือกไฟล์และกรอกชื่อเล่น",
  "requesting-url": "Frontend ขอ presigned URL จาก Backend",
  "uploading-file": "Frontend upload ไฟล์ตรงเข้า Object Storage",
  "saving-metadata": "Backend บันทึก nickname + avatarKey ลง Database",
  done: "เสร็จแล้ว กลับไปดู object ใน MinIO Console ได้",
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function createPresignedUpload(file: File) {
  // Step 1: ask the backend for an upload ticket.
  // The frontend sends file metadata only, not the file bytes yet.
  const response = await fetch(`${API_BASE_URL}/storage/presign-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });

  return parseResponse<PresignedUpload>(response);
}

async function createProfile(input: { nickname: string; avatarKey: string }) {
  // Step 3: after the upload succeeds, save only metadata in the database.
  // The actual image bytes are already in MinIO.
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseResponse<Profile>(response);
}

async function listProfiles() {
  const response = await fetch(`${API_BASE_URL}/profiles`);
  return parseResponse<Profile[]>(response);
}

export default function StorageWorkshopPage() {
  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [step, setStep] = useState<UploadStep>("idle");
  const [lastObjectKey, setLastObjectKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void refreshProfiles();
  }, []);

  const canSubmit = useMemo(
    () => nickname.trim().length > 0 && file !== null && !isSubmitting,
    [file, isSubmitting, nickname],
  );

  function handleFileChange(selectedFile: File | null) {
    setError(null);
    setLastObjectKey(null);
    setStep("idle");

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("รองรับเฉพาะ PNG, JPG และ WEBP");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.size > maxFileBytes) {
      setError("ไฟล์ใหญ่เกิน 5MB");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  async function refreshProfiles() {
    const nextProfiles = await listProfiles().catch(() => []);
    setProfiles(nextProfiles);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setError(null);

    try {
      setStep("requesting-url");
      const { key, uploadUrl } = await createPresignedUpload(file);

      setStep("uploading-file");
      // Step 2: upload directly to object storage with the temporary URL.
      // This keeps large files away from the backend server.
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      setLastObjectKey(key);
      setStep("saving-metadata");
      await createProfile({ nickname: nickname.trim(), avatarKey: key });

      setNickname("");
      setFile(null);
      setPreviewUrl(null);
      setStep("done");
      await refreshProfiles();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Upload failed");
      setStep("idle");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Storage Workshop
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Freshmen Profile Card
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              เป้าหมายของหน้านี้คือให้น้องเห็น flow จริงของการ upload:
              frontend ขอสิทธิ์จาก backend, storage เก็บไฟล์จริง, database
              เก็บ object key เป็น metadata
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FlowCard title="1. File" body="เลือกไฟล์จาก Browser" />
            <FlowCard title="2. Backend" body="validate + ออก URL" />
            <FlowCard title="3. Storage" body="เก็บไฟล์จริงใน bucket" />
            <FlowCard title="4. Database" body="เก็บ avatarKey" />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={handleSubmit}
          >
            <div>
              <h2 className="text-2xl font-bold">Create Profile</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                หลัง upload สำเร็จ ให้กลับไปดู bucket `club-assets` ใน MinIO
                Console เพื่อเห็น object ใหม่
              </p>
            </div>

            <label className="mt-6 grid gap-2">
              <span className="font-semibold text-slate-700">Nickname</span>
              <input
                className="rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                maxLength={40}
                placeholder="เช่น Mint, Poom, Alice"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            </label>

            <label className="mt-5 grid aspect-[1.45] cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] ?? null)
                }
              />
              {previewUrl ? (
                <img
                  className="h-full w-full object-cover"
                  src={previewUrl}
                  alt="Avatar preview"
                />
              ) : (
                <div className="px-8 text-center text-slate-500">
                  <div className="text-4xl">Upload</div>
                  <p className="mt-3 text-sm">PNG/JPG/WEBP ไม่เกิน 5MB</p>
                </div>
              )}
            </label>

            <button
              className="mt-5 w-full rounded-md bg-blue-700 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSubmit}
            >
              {isSubmitting ? "Uploading..." : "Create Profile"}
            </button>

            <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-medium text-blue-900">
              {stepLabel[step]}
            </div>

            {lastObjectKey && (
              <div className="mt-3 overflow-hidden rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
                <span className="font-bold">Object key:</span>
                <span className="ml-2 break-all font-mono">{lastObjectKey}</span>
              </div>
            )}

            {error && (
              <div className="mt-3 rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
                {error}
              </div>
            )}
          </form>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Created Profiles</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  รูปใน card แสดงผ่าน signed read URL ที่ backend สร้างให้
                </p>
              </div>
              <button
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                onClick={() => void refreshProfiles()}
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {profiles.length === 0 ? (
                <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 md:col-span-2">
                  ยังไม่มี profile ลองสร้างอันแรกได้เลย
                </div>
              ) : (
                profiles.map((profile) => (
                  <article
                    className="grid grid-cols-[80px_1fr] gap-4 rounded-lg border border-slate-200 p-3"
                    key={profile.id}
                  >
                    <img
                      className="h-20 w-20 rounded-md object-cover"
                      src={profile.avatarUrl}
                      alt={`${profile.nickname} avatar`}
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-950">
                        {profile.nickname}
                      </h3>
                      <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-500">
                        {profile.avatarKey}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function FlowCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="font-bold text-slate-950">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{body}</div>
    </div>
  );
}
