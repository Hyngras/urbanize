import { Center, Spinner } from "@chakra-ui/react";

export function LoadingState() {
  return (
    <Center py={10}>
      <Spinner color="brand.500" />
    </Center>
  );
}
