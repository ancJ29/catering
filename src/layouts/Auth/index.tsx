import { Center, Container } from "@mantine/core";

const AuthLayout = ({
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Center
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to top, rgb(223, 233, 243) 0%, white 100%)",
      }}
    >
      <Container w={480} size="xs" pb={16}>
        {children}
      </Container>
    </Center>
  );
};
export default AuthLayout;
