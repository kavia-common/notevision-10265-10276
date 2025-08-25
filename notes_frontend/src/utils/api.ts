export type Note = {
  id: string;
  title: string;
  content: string; // HTML string from rich editor
  updatedAt: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name?: string | null;
};

type ApiResult<T> = { data?: T; error?: string };

const getApiBase = (): string => {
  // PUBLIC_INTERFACE
  /**
   * Returns the base URL of the backend API.
   * This value should be set via environment variables in deployment (e.g., VITE_API_BASE).
   * If not provided, defaults to relative /api for local proxy setups.
   */
  const envBase =
    (typeof process !== "undefined" &&
      (process as any).env &&
      (process as any).env.VITE_API_BASE) ||
    (typeof (globalThis as any).VITE_API_BASE !== "undefined"
      ? (globalThis as any).VITE_API_BASE
      : null);
  return (envBase as string) || "/api";
};

const getAuthHeader = () => {
  const token =
    (typeof window !== "undefined" &&
      typeof localStorage !== "undefined" &&
      localStorage.getItem("auth_token")) ||
    "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request<T>(
  path: string,
  options: RequestInit = {} as any
): Promise<ApiResult<T>> {
  try {
    const doFetch: typeof fetch =
      (typeof fetch !== "undefined" && fetch) ||
      (((..._args: any[]) => {
        throw new Error("fetch unavailable");
      }) as any);
    const resp = await doFetch(`${getApiBase()}${path}`, {
      ...(options as any),
      headers: {
        "Content-Type": "application/json",
        ...((options as any).headers || {}),
        ...getAuthHeader(),
      },
    });
    if (!resp.ok) {
      const msg = await safeText(resp);
      return { error: msg || `HTTP ${resp.status}` };
    }
    const text = await resp.text();
    if (!text) return { data: undefined as unknown as T };
    const json = JSON.parse(text);
    return { data: json as T };
  } catch (e: any) {
    return { error: e?.message || "Network error" };
  }
}

async function safeText(resp: any): Promise<string> {
  try {
    const t = await resp.text();
    try {
      const j = JSON.parse(t);
      return j?.error || j?.message || t;
    } catch {
      return t;
    }
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  /** Logs in a user and stores token */
  const res = await request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("auth_token", res.data.token);
    }
  }
  return res;
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears auth token */
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

// PUBLIC_INTERFACE
export async function getMe() {
  /** Fetches current user using token */
  return request<User>("/auth/me", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Returns a list of notes for the current user */
  return request<Note[]>("/notes", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id: string) {
  /** Returns a note by id */
  return request<Note>(`/notes/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }) {
  /** Creates a new note for the current user */
  return request<Note>("/notes", { method: "POST", body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function updateNote(
  id: string,
  payload: { title?: string; content?: string }
) {
  /** Updates a note by id */
  return request<Note>(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  /** Deletes a note by id */
  return request<{ success: boolean }>(`/notes/${id}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export async function generateNoteVideo(id: string) {
  /**
   * Asks backend to generate a video for the given note.
   * Returns a job identifier or immediate URL depending on backend implementation.
   */
  return request<{ jobId?: string; url?: string }>(`/notes/${id}/video`, {
    method: "POST",
  });
}

// PUBLIC_INTERFACE
export async function getNoteVideoStatus(id: string, jobId: string) {
  /** Polls the generation status for a note video job */
  return request<{ status: "pending" | "processing" | "done" | "error"; url?: string; error?: string }>(
    `/notes/${id}/video/${jobId}`,
    { method: "GET" }
  );
}
