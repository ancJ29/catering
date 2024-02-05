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
import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } = actionConfigs[Actions.GET_USERS].schema;
export type GerUsersRequest = z.infer<typeof request>;
export type GetUsersResponse = z.infer<typeof response>;

const UserManagement = () => {
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [users, setUsers] = useState<GenericObject[]>([]);

  const _reload = useCallback(
    async (noCache?: boolean) => {
      if (noCache) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      _loadAllUsers(noCache).then((users) => setUsers(users || []));
      close();
    },
    [close],
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

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <Flex w={"100%"} justify="end">
        <Button mr={8} w={100} onClick={open}>
          {t("Add")}
        </Button>
      </Flex>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={users}
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
): Promise<GenericObject[]> {
  const res = await callApi<GerUsersRequest, GetUsersResponse>({
    action: Actions.GET_USERS,
    params: {
      take: 100,
      cursor,
    },
    options: { noCache },
  });

  if (res?.hasMore) {
    return (res.users as GenericObject[]).concat(
      await _loadAllUsers(noCache, res.cursor),
    );
  }
  return res?.users || [];
}

export default UserManagement;
