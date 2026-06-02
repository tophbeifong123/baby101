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

const uploadStages: Array<{
  id: UploadStep;
  title: string;
  detail: string;
}> = [
  {
    id: "requesting-url",
    title: "Request upload ticket",
    detail: "Backend ตรวจ metadata แล้วออก URL ชั่วคราวให้ไฟล์นี้",
  },
  {
    id: "uploading-file",
    title: "PUT file to storage",
    detail: "Browser ส่งไฟล์จริงเข้า MinIO โดยตรง",
  },
  {
    id: "saving-metadata",
    title: "Save metadata",
    detail: "Backend เก็บ nickname, bucket และ object key ลง DB",
  },
  {
    id: "done",
    title: "Ready to inspect",
    detail: "object อยู่ใน MinIO และ profile อยู่ใน PostgreSQL แล้ว",
  },
];

const flowItems = [
  {
    title: "Browser",
    body: "เลือกไฟล์แล้วขอสิทธิ์ upload",
    color: "border-[oklch(0.78_0.12_230)] bg-[oklch(0.97_0.025_230)]",
  },
  {
    title: "Backend",
    body: "validate, สร้าง key, sign URL",
    color: "border-[oklch(0.74_0.14_113)] bg-[oklch(0.96_0.035_113)]",
  },
  {
    title: "MinIO",
    body: "เก็บไฟล์จริงใน bucket",
    color: "border-[oklch(0.75_0.13_42)] bg-[oklch(0.97_0.035_42)]",
  },
  {
    title: "Database",
    body: "เก็บ metadata และ object key",
    color: "border-[oklch(0.70_0.13_285)] bg-[oklch(0.97_0.026_285)]",
  },
];

const stepLabel: Record<UploadStep, string> = {
  idle: "พร้อมสร้าง profile ใหม่",
  "requesting-url": "กำลังขอ presigned URL จาก backend",
  "uploading-file": "กำลัง upload ไฟล์ตรงเข้า object storage",
  "saving-metadata": "กำลังบันทึก nickname และ avatarKey ลง PostgreSQL",
  done: "upload สำเร็จแล้ว กลับไปดู object ใหม่ใน MinIO ได้",
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    void refreshProfiles();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSubmit = useMemo(
    () => nickname.trim().length > 0 && file !== null && !isSubmitting,
    [file, isSubmitting, nickname],
  );

  const activeStageIndex = uploadStages.findIndex((stage) => stage.id === step);
  const createdCount = profiles.length;

  function handleFileChange(selectedFile: File | null) {
    setError(null);
    setLastObjectKey(null);
    setStep("idle");

    if (previewUrl) URL.revokeObjectURL(previewUrl);

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
    setIsRefreshing(true);
    const nextProfiles = await listProfiles().catch(() => []);
    setProfiles(nextProfiles);
    setIsRefreshing(false);
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
    <main className="min-h-screen bg-[oklch(0.985_0.004_113)] text-[oklch(0.18_0.025_145)]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="grid gap-5 border-b border-[oklch(0.88_0.02_120)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[oklch(0.36_0.07_150)]">
              <span className="rounded-full border border-[oklch(0.79_0.08_113)] bg-white px-3 py-1">
                Storage Workshop
              </span>
              <span className="rounded-full bg-[oklch(0.90_0.08_113)] px-3 py-1 text-[oklch(0.25_0.06_125)]">
                S3-compatible upload flow
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[oklch(0.13_0.024_150)] sm:text-5xl">
              Freshmen Profile Card
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[oklch(0.38_0.028_150)] sm:text-lg">
              ทดลอง flow จริงของการ upload: backend ออก presigned URL,
              MinIO เก็บไฟล์จริง และ PostgreSQL เก็บ object key
            </p>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
            <Metric label="Profiles" value={String(createdCount)} />
            <Metric label="Max file" value="5 MiB" />
            <Metric label="URL TTL" value="300s" />
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[430px_1fr]">
          <form
            className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-5 shadow-[0_6px_8px_oklch(0.18_0.02_145_/_0.04)]"
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[oklch(0.13_0.024_150)]">
                  Create profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-[oklch(0.42_0.026_150)]">
                  object จะถูกเก็บใน bucket <span className="font-mono">club-assets</span>
                </p>
              </div>
              <StatusPill step={step} />
            </div>

            <label className="mt-6 grid gap-2">
              <span className="text-sm font-bold text-[oklch(0.28_0.03_145)]">
                Nickname
              </span>
              <input
                className="h-12 rounded-lg border border-[oklch(0.83_0.018_125)] bg-[oklch(0.99_0_0)] px-3 text-base font-medium outline-none transition focus:border-[oklch(0.58_0.12_113)] focus:ring-4 focus:ring-[oklch(0.88_0.09_113)]"
                maxLength={40}
                placeholder="Mint, Poom, Alice"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            </label>

            <label className="group mt-5 grid aspect-[1.38] cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-[oklch(0.74_0.05_125)] bg-[oklch(0.975_0.012_113)] transition hover:border-[oklch(0.56_0.13_113)] hover:bg-[oklch(0.96_0.03_113)]">
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] ?? null)
                }
              />
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <img
                    className="h-full w-full object-cover"
                    src={previewUrl}
                    alt="Avatar preview"
                  />
                  <div className="absolute inset-x-3 bottom-3 rounded-lg bg-[oklch(0.12_0.018_145_/_0.82)] px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                    {file?.name}
                  </div>
                </div>
              ) : (
                <div className="px-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[oklch(0.23_0.07_145)] text-lg font-black text-white shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.18)]">
                    UP
                  </div>
                  <div className="mt-4 text-lg font-black text-[oklch(0.20_0.032_145)]">
                    เลือกรูป avatar
                  </div>
                  <p className="mt-2 text-sm font-medium text-[oklch(0.42_0.026_150)]">
                    PNG, JPG หรือ WEBP ไม่เกิน 5 MiB
                  </p>
                </div>
              )}
            </label>

            {file && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <FileFact label="Type" value={file.type || "unknown"} />
                <FileFact label="Size" value={formatBytes(file.size)} />
              </div>
            )}

            <button
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[oklch(0.54_0.13_113)] px-4 text-base font-black text-white transition hover:bg-[oklch(0.48_0.13_113)] focus:outline-none focus:ring-4 focus:ring-[oklch(0.86_0.10_113)] disabled:cursor-not-allowed disabled:bg-[oklch(0.78_0.018_120)]"
              disabled={!canSubmit}
            >
              {isSubmitting ? "กำลัง upload profile" : "Create profile"}
            </button>

            <div className="mt-4 rounded-lg border border-[oklch(0.82_0.035_220)] bg-[oklch(0.97_0.025_220)] p-3 text-sm font-semibold text-[oklch(0.28_0.06_220)]">
              {stepLabel[step]}
            </div>

            {lastObjectKey && (
              <div className="mt-3 rounded-lg border border-[oklch(0.78_0.08_145)] bg-[oklch(0.96_0.04_145)] p-3 text-sm text-[oklch(0.25_0.06_145)]">
                <span className="font-black">Object key</span>
                <span className="mt-1 block break-all font-mono text-xs leading-5">
                  {lastObjectKey}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-3 rounded-lg border border-[oklch(0.74_0.12_25)] bg-[oklch(0.96_0.035_25)] p-3 text-sm font-bold text-[oklch(0.33_0.09_25)]">
                {error}
              </div>
            )}
          </form>

          <section className="grid min-w-0 gap-5">
            <div className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-5 shadow-[0_6px_8px_oklch(0.18_0.02_145_/_0.04)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[oklch(0.13_0.024_150)]">
                    Upload pipeline
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[oklch(0.42_0.026_150)]">
                    แต่ละ step ตรงกับ service boundary จริงใน workshop
                  </p>
                </div>
                <div className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-[oklch(0.985_0.004_113)] px-3 py-2 font-mono text-xs text-[oklch(0.34_0.036_150)]">
                  API {API_BASE_URL}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {flowItems.map((item) => (
                  <FlowCard key={item.title} {...item} />
                ))}
              </div>

              <div className="mt-5 grid gap-3">
                {uploadStages.map((stage, index) => (
                  <StageRow
                    detail={stage.detail}
                    index={index}
                    isActive={stage.id === step}
                    isComplete={
                      step === "done" || (activeStageIndex > -1 && index < activeStageIndex)
                    }
                    key={stage.id}
                    title={stage.title}
                  />
                ))}
              </div>
            </div>

            <section className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-5 shadow-[0_6px_8px_oklch(0.18_0.02_145_/_0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[oklch(0.13_0.024_150)]">
                    Created profiles
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[oklch(0.42_0.026_150)]">
                    รูปแสดงผ่าน signed read URL ที่ backend สร้างให้
                  </p>
                </div>
                <button
                  className="h-10 rounded-lg border border-[oklch(0.80_0.026_125)] bg-[oklch(0.99_0_0)] px-3 text-sm font-bold text-[oklch(0.25_0.04_145)] transition hover:border-[oklch(0.58_0.12_113)] hover:bg-[oklch(0.96_0.03_113)] focus:outline-none focus:ring-4 focus:ring-[oklch(0.88_0.09_113)] disabled:cursor-wait disabled:opacity-70"
                  disabled={isRefreshing}
                  onClick={() => void refreshProfiles()}
                >
                  {isRefreshing ? "Refreshing" : "Refresh profiles"}
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {isRefreshing && profiles.length === 0 ? (
                  <ProfileSkeleton />
                ) : profiles.length === 0 ? (
                  <EmptyProfiles />
                ) : (
                  profiles.map((profile) => (
                    <article
                      className="grid min-w-0 grid-cols-[72px_1fr] gap-4 rounded-lg border border-[oklch(0.86_0.018_120)] bg-[oklch(0.99_0_0)] p-3"
                      key={profile.id}
                    >
                      <img
                        className="h-[72px] w-[72px] rounded-lg object-cover"
                        src={profile.avatarUrl}
                        alt={`${profile.nickname} avatar`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-base font-black text-[oklch(0.14_0.026_150)]">
                            {profile.nickname}
                          </h3>
                          <span className="rounded-full bg-[oklch(0.92_0.07_113)] px-2 py-1 text-xs font-black text-[oklch(0.26_0.07_125)]">
                            stored
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-[oklch(0.45_0.026_150)]">
                          {formatDate(profile.createdAt)}
                        </p>
                        <p className="mt-2 break-all font-mono text-xs leading-5 text-[oklch(0.38_0.036_150)]">
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
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white px-4 py-3">
      <div className="text-xs font-bold text-[oklch(0.44_0.026_150)]">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-black text-[oklch(0.15_0.026_150)]">
        {value}
      </div>
    </div>
  );
}

function FileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-[oklch(0.985_0.004_113)] px-3 py-2">
      <div className="text-xs font-bold text-[oklch(0.44_0.026_150)]">
        {label}
      </div>
      <div className="mt-1 truncate font-mono text-xs font-bold text-[oklch(0.18_0.025_145)]">
        {value}
      </div>
    </div>
  );
}

function StatusPill({ step }: { step: UploadStep }) {
  const done = step === "done";
  const idle = step === "idle";

  return (
    <div
      className={[
        "rounded-full px-3 py-1 text-xs font-black",
        done
          ? "bg-[oklch(0.92_0.07_145)] text-[oklch(0.25_0.07_145)]"
          : idle
            ? "bg-[oklch(0.92_0.06_220)] text-[oklch(0.28_0.07_220)]"
            : "bg-[oklch(0.91_0.08_42)] text-[oklch(0.32_0.08_42)]",
      ].join(" ")}
    >
      {done ? "Complete" : idle ? "Ready" : "In progress"}
    </div>
  );
}

function FlowCard({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <div className="text-sm font-black text-[oklch(0.16_0.026_150)]">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[oklch(0.37_0.028_150)]">
        {body}
      </p>
    </div>
  );
}

function StageRow({
  detail,
  index,
  isActive,
  isComplete,
  title,
}: {
  detail: string;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  title: string;
}) {
  return (
    <div
      className={[
        "grid grid-cols-[34px_1fr] gap-3 rounded-lg border p-3 transition",
        isActive
          ? "border-[oklch(0.58_0.12_113)] bg-[oklch(0.96_0.035_113)]"
          : isComplete
            ? "border-[oklch(0.78_0.07_145)] bg-[oklch(0.975_0.028_145)]"
            : "border-[oklch(0.86_0.018_120)] bg-[oklch(0.99_0_0)]",
      ].join(" ")}
    >
      <div
        className={[
          "grid h-[34px] w-[34px] place-items-center rounded-lg font-mono text-sm font-black",
          isActive || isComplete
            ? "bg-[oklch(0.23_0.07_145)] text-white"
            : "bg-[oklch(0.93_0.012_120)] text-[oklch(0.42_0.026_150)]",
        ].join(" ")}
      >
        {isComplete ? "OK" : index + 1}
      </div>
      <div className="min-w-0">
        <div className="font-black text-[oklch(0.15_0.026_150)]">{title}</div>
        <p className="mt-1 text-sm leading-6 text-[oklch(0.42_0.026_150)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <>
      {[0, 1].map((item) => (
        <div
          className="grid grid-cols-[72px_1fr] gap-4 rounded-lg border border-[oklch(0.86_0.018_120)] p-3"
          key={item}
        >
          <div className="h-[72px] w-[72px] animate-pulse rounded-lg bg-[oklch(0.92_0.012_120)]" />
          <div className="space-y-3 py-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[oklch(0.92_0.012_120)]" />
            <div className="h-3 w-40 animate-pulse rounded-full bg-[oklch(0.93_0.012_120)]" />
            <div className="h-3 w-full animate-pulse rounded-full bg-[oklch(0.94_0.012_120)]" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyProfiles() {
  return (
    <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-[oklch(0.78_0.035_125)] bg-[oklch(0.985_0.004_113)] px-6 text-center md:col-span-2">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white font-mono text-sm font-black text-[oklch(0.32_0.07_145)]">
          DB
        </div>
        <h3 className="mt-4 text-lg font-black text-[oklch(0.18_0.025_145)]">
          No profile metadata yet
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[oklch(0.42_0.026_150)]">
          สร้าง profile แรกเพื่อดูว่า database เก็บ object key อย่างไร
        </p>
      </div>
    </div>
  );
}
