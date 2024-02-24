import Loader from "@/components/common/Loader";
import { resolver, theme } from "@/configs/theme/mantine-theme";
import authRoutes from "@/router/auth.route";
import guestRoutes from "@/router/guest.route";
import loadingStore from "@/services/api/loading-store";
import useAuthStore from "@/stores/auth.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { RouteObject, useRoutes } from "react-router-dom";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const { loadToken, user } = useAuthStore();
  const { loadMetaData } = useMetaDataStore();

  const loading = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.getSnapshot,
  );

  useEffect(() => {
    // Note: Don't load twice
    if (loaded) {
      return;
    }
    loadToken();
    loadMetaData().then(() => {
      setLoaded(true);
    });
  }, [loadToken, loaded, loadMetaData, user?.id]);

  useEffect(() => {
    // Note: Don't load users if user is not logged in
    if (!user?.id) {
      return;
    }
  }, [user]);

  const routes = useMemo(() => {
    return _buildRoutes(loaded, !!user);
  }, [user, loaded]);

  return (
    <MantineProvider theme={theme} cssVariablesResolver={resolver}>
      <ModalsProvider>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {useRoutes(routes)}
        <Notifications position="top-right" zIndex={1000} />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;

function _buildRoutes(loaded: boolean, login: boolean) {
  if (!loaded) {
    return [
      {
        path: "/*",
        element: <Loader />,
      } as RouteObject,
    ];
  }
  return login ? authRoutes : guestRoutes;
}
