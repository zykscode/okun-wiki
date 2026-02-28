import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <BookOpen className="h-10 w-10 text-primary-500 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-wiki-text">Welcome back</h1>
            <p className="text-sm text-wiki-muted mt-1">
              Sign in to your Okunpedia account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-wiki-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
