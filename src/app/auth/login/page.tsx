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
            <BookOpen className="h-10 w-10 text-forest-600 dark:text-forest-400 mx-auto mb-3" />
            <h1 className="text-3xl font-display font-medium text-wiki-text tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-wiki-muted mt-1">Sign in to your Okunpedia account</p>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-wiki-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-forest-600 dark:text-forest-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
