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
            <BookOpen className="h-10 w-10 text-primary-500 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-wiki-text">Join Ọ̀kun Wiki</h1>
            <p className="text-sm text-wiki-muted mt-1">
              Help document the heritage of Ọ̀kun land
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-center text-sm text-wiki-muted mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
