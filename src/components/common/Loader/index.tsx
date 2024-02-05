import { Box, Center, Loader as MantineLoader } from "@mantine/core";

const Loader = () => {
  return (
    <Box pos="absolute" w="100vw" h="100vh">
      <Center h="100vh">
        <MantineLoader color="blue" size="lg" type="bars" />
      </Center>
    </Box>
  );
};

export default Loader;
