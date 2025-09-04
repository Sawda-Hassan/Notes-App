import { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";

export default function AuthForm({ onAuthed }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      const url = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      const { data } = await api.post(url, body);
      setToken(data.token);
      onAuthed(data.user);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErr("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
      <h2 className="text-xl font-semibold mb-2">{mode === "login" ? "Sign in" : "Create account"}</h2>
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <form onSubmit={submit} className="grid gap-3">
        {mode === "register" && (
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="rounded-xl border px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-xl border px-3 py-2"
          type="password"
          placeholder="Password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
          {mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>
      <div className="mt-3 text-sm">
        {mode === "login" ? (
          <button
            type="button"
            className="underline"
            onClick={() => switchMode("register")}
          >
            Create an account
          </button>
        ) : (
          <button
            type="button"
            className="underline"
            onClick={() => switchMode("login")}
          >
            Have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
