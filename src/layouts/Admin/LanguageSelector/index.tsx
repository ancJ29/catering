import { LanguageContext } from "@/contexts/LanguageContext";
import { languageOptions } from "@/services/i18n";
import {
  Anchor,
  Button,
  Flex,
  Image,
  Popover,
  Text,
} from "@mantine/core";
import { useContext, useState } from "react";
import classes from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  const { language, onChangeLanguage } = useContext(LanguageContext);
  const [opened, setOpened] = useState(false);

  const handleLanguageChange = (value: string | null) => {
    if (language === value) {
      return;
    }
    setOpened(false);
    onChangeLanguage?.(value || "vi");
  };

  return (
    <Flex align="center">
      <Popover
        opened={opened}
        width={300}
        trapFocus
        position="bottom"
        withArrow
        shadow="md"
        onClose={() => setOpened(false)}
      >
        <Popover.Target>
          <Button
            onClick={() => setOpened(!opened)}
            p={0}
            h={40}
            w={40}
            radius={999}
            className={classes.btnIcon}
          >
            <Image
              radius="lg"
              h={20}
              w={20}
              src={`/img/flags/${language}.svg`}
              alt={language}
            />
          </Button>
        </Popover.Target>
        <Popover.Dropdown p={0} w={"auto"}>
          {Object.entries(languageOptions).map(([id, name]) => (
            <Anchor
              key={id}
              onClick={() => handleLanguageChange(id)}
              className={classes.item}
            >
              <Image
                radius="lg"
                h={20}
                w={20}
                src={`/img/flags/${id}.svg`}
                alt={name}
              />
              <Text>{name}</Text>
            </Anchor>
          ))}
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};
export default LanguageSelector;
