"use client";
import { LoginForm } from '../../../components/login-form'
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && data?.session && data?.user) {
      router.push("/");
    }
  }, [data?.session, data?.user, router, isMounted]);

  if (!isMounted || isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default page
