import { Flex, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";
import { useVisualTheme } from "../../hooks/useVisualTheme";

export const AvenueSkeleton = () => {
  const { getColor } = useVisualTheme();

  return (
    <Flex
      direction="column"
      flex="1"
      minH="100vh"
      p={4}
      bg={getColor("background.primary")}
    >
      <Flex direction="column" flex="1" bg={getColor("background.primary")}>
        <Flex direction="column" flex="1" pb={0}>
          {/* Header com botão voltar e título */}
          <Flex
            direction="row"
            gap={4}
            justify="flex-start"
            align="center"
            mb={6}
          >
            <SkeletonCircle size="10" />
            <Skeleton height="32px" width="200px" />
          </Flex>

          {/* Formulário */}
          <Stack spacing={4} flex="1">
            {/* Campo Nome */}
            <Flex direction="column" gap={2}>
              <Skeleton height="16px" width="60px" />
              <Skeleton height="40px" borderRadius="md" />
            </Flex>

            {/* Campo Valor */}
            <Flex direction="column" gap={2}>
              <Skeleton height="16px" width="50px" />
              <Skeleton height="40px" borderRadius="md" />
            </Flex>

            {/* Campo Data */}
            <Flex direction="column" gap={2}>
              <Skeleton height="16px" width="40px" />
              <Skeleton height="40px" borderRadius="md" />
            </Flex>

            {/* Checkbox Recorrente */}
            <Flex align="center" gap={2}>
              <Skeleton height="20px" width="20px" borderRadius="sm" />
              <Skeleton height="16px" width="120px" />
            </Flex>
          </Stack>

          {/* Botão no bottom */}
          <Flex justify="center" align="center" mt="auto" width="100%">
            <Skeleton height="48px" width="100%" borderRadius="md" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
