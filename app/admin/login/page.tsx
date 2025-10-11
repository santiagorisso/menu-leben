"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <Card className="w-full max-w-2xl p-8 bg-zinc-900 border-zinc-800">
          <h1 className="text-2xl font-bold mb-4 text-orange-500">Firebase Authentication Required</h1>
          <p className="mb-4 text-zinc-300">
            Firebase Authentication is not enabled. Please enable it in your Firebase Console:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-300">
            <li>
              Go to{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Firebase Console
              </a>
            </li>
            <li>Select your project</li>
            <li>Click "Authentication" in the left sidebar</li>
            <li>Click "Get started"</li>
            <li>Go to "Sign-in method" tab</li>
            <li>Enable "Email/Password"</li>
            <li>Create your first admin user in the "Users" tab</li>
          </ol>
          <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
            Back to Menu
          </Button>
        </Card>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
