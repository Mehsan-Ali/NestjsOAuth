import { useState } from "react";
import { authAPI } from "../APIs/Auth.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authAPI.login(email, password);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}
