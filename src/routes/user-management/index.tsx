import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import AddUserForm from "@/components/users/AddUserForm";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { GenericObject } from "@/types";
import {
  Button,
  Flex,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } = actionConfigs[Actions.GET_USERS].schema;
export type GerUsersRequest = z.infer<typeof request>;
export type GetUsersResponse = z.infer<typeof response>;

const userSchema = response.shape.users.transform(
  (users) => users[0],
);

type User = z.infer<typeof userSchema>;

const UserManagement = () => {
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const [filter, setFilter] = useState({ keyword: "" });

  const _reload = useCallback(
    async (noCache?: boolean) => {
      if (noCache) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      _loadAllUsers(noCache).then((users) => {
        setUsers(users || []);
        setData(users || []);
      });
      close();
    },
    [close],
  );

  const search = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!filter.keyword) {
        return;
      }
      const keyword = filter.keyword.toLowerCase();
      setData(
        users.filter((user) => {
          if (keyword) {
            if (user.fullName.toLocaleLowerCase().includes(keyword)) {
              return true;
            }
            if (user.userName.toLocaleLowerCase().includes(keyword)) {
              return true;
            }
            if (user.email?.toLocaleLowerCase().includes(keyword)) {
              return true;
            }
            return false;
          }
          return true;
        }),
      );
    },
    [filter.keyword, users],
  );

  useOnMounted(_reload);

  const onDelete = useCallback(
    (user?: GenericObject) => {
      modals.openConfirmModal({
        title: `${t("Deactivate user")}: ${user?.fullName || ""}`,
        children: (
          <Text size="sm">
            {t("Are you sure you want to deactivate this user?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          await callApi({
            action: Actions.DISABLE_USERS,
            params: { ids: [user?.id] },
          }).then(() => _reload(true));
        },
      });
    },
    [_reload, t],
  );

  const handleKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target?.value.trim() || "";
      if (keyword !== filter.keyword) {
        setFilter({ keyword });
        if (!keyword) {
          setData(users);
        }
      }
    },
    [filter.keyword, users],
  );

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <Flex w={"100%"} justify="end" align="center" gap={12}>
        <form
          onSubmit={search}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <TextInput
            value={filter.keyword}
            onChange={handleKeywordChange}
          />
          <Button
            ml={8}
            w={100}
            type="submit"
            disabled={!filter.keyword}
          >
            {t("Search")}
          </Button>
        </form>
        <Button w={100} onClick={open}>
          {t("Add")}
        </Button>
      </Flex>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        actionHandlers={{
          onDelete,
          deletable: (user) => user?.active === true,
        }}
      />
      <Modal
        opened={opened}
        onClose={close}
        title={t("Add user")}
        centered
        size="lg"
        classNames={{ title: "font-bold" }}
      >
        <div className="bdr-t"></div>
        <AddUserForm
          onClose={close}
          onSuccess={() => _reload(true)}
        />
      </Modal>
    </Stack>
  );
};

async function _loadAllUsers(
  noCache?: boolean,
  cursor?: string,
): Promise<User[]> {
  const res = await callApi<GerUsersRequest, GetUsersResponse>({
    action: Actions.GET_USERS,
    params: {
      take: 100,
      cursor,
    },
    options: { noCache },
  });

  if (res?.hasMore) {
    return (res?.users || []).concat(
      await _loadAllUsers(noCache, res.cursor),
    );
  }
  return res?.users || [];
}

export default UserManagement;
