import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { CookiesProvider } from 'react-cookie';

import '@/styles/index.scss';
import { Layout } from '@/components/Layout/Layout';
import ColorSchemeToggle from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export default function App() {
  return (
    <CookiesProvider>
      <MantineProvider>
        <Notifications />
          <Layout/>
        <ColorSchemeToggle />
      </MantineProvider>
    </CookiesProvider>
  );
}
