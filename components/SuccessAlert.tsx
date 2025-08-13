import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SuccessAlert({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="fixed bottom-5 right-4 z-50 grid w-full max-w-xl items-start gap-4">
      <Alert className="bg-green-100 text-green-800">
        <CheckCircle2Icon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
