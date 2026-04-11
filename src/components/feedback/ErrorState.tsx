import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export function ErrorState({ message }: { message: string }) {
  return (
    <Alert status="error" variant="left-accent" borderRadius="md">
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
