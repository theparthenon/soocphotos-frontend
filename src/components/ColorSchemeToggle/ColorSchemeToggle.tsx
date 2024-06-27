import { Button, Menu, useMantineColorScheme } from '@mantine/core';
import { IconMoonFilled as Moon, IconSunFilled as Sun } from '@tabler/icons-react';
import { useCallback, useMemo, useState } from 'react';
import { Cookies } from 'react-cookie';

import { ColorScheme } from '@/@types/ui';

export default function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const cookies = useMemo(() => new Cookies(), []);
  const [colorSchemeCookie, setColorSchemeCookie] = useState<ColorScheme>(cookies.get('mantine-color-scheme') ? cookies.get('mantine-color-scheme') : 'light');

  const toggleColorScheme = useCallback(
    value => {
      const nextColorScheme = value || (colorSchemeCookie === "dark" ? "light" : "dark");
      cookies.set(
        "mantine-color-scheme",
        nextColorScheme,
        { maxAge: 60 * 60 * 24 * 356, sameSite: "strict" }
      );
      setColorScheme(nextColorScheme);
      setColorSchemeCookie(nextColorScheme);
    },
    [colorSchemeCookie, cookies, setColorScheme]
  );

  return (
    <div className="colorSchemeToggle">
      <Menu>
        <Menu.Target>
          <Button
            variant="gradient"
            gradient={{ from: "#43cea2", to: "#185a9d" }}
          >{ colorScheme === 'light' ? <Sun size={18} /> : <Moon size={18} /> }</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => toggleColorScheme('light')}><Sun size={14} /></Menu.Item>
          <Menu.Item onClick={() => toggleColorScheme('dark')}><Moon size={14} /></Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
