import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}
