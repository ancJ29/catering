import { Center, Text, TextProps } from "@mantine/core";
interface Props extends TextProps {
  children: React.ReactNode;
}

const TextCenter = ({ children, ...props }: Props) => {
  return (
    <Center>
      <Text {...props}>{children}</Text>
    </Center>
  );
};

export default TextCenter;
