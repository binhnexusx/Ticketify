  import { useCallback, useState } from "react";

  let toastIdCounter = 0;

  export function useToast() {
    const [toasts, setToasts] = useState<any[]>([]);

    const toast = useCallback(
      ({
        title,
        description,
        variant = "default",
      }: {
        title: string;
        description?: string;
        variant?: "default" | "destructive" | "success" | "info";
      }) => {
        const id = toastIdCounter++;
        setToasts((prev) => [...prev, { id, title, description, variant }]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
      },
      []
  );

    return {
      toast,
      toasts,
      setToasts,
    };
  }
