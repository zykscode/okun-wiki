import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <BookOpen className="h-10 w-10 text-forest-600 dark:text-forest-400 mx-auto mb-3" />
            <h1 className="text-3xl font-display font-medium text-wiki-text tracking-tight">
              Join Okunpedia
            </h1>
            <p className="text-sm text-wiki-muted mt-1">Help document the heritage of Okun land</p>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-center text-sm text-wiki-muted mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-forest-600 dark:text-forest-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
