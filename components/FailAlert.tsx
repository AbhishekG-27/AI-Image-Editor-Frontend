import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FailAlert({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="fixed bottom-5 right-4 z-50 grid w-full max-w-xl items-start gap-4">
      <Alert variant="destructive" className="bg-red-100 text-red-800">
        <AlertCircleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
