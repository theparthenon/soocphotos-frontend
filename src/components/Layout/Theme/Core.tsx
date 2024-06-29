import { AppShell, AppShellMain, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Views from "@/components/Layout/Views";
import SideBar from "@/components/Layout/Theme/SideBar";
import Header from "./Header";
import { LEFT_MENU_WIDTH, TOP_MENU_HEIGHT } from "@/constants/ui.constant";

export default function Theme(){
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
      header={{ height: TOP_MENU_HEIGHT }}
      navbar={{
        width: LEFT_MENU_WIDTH,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      >
        <Header opened={opened} toggle={toggle} />
        <SideBar />
        <AppShell.Main style={{ zIndex: 200 }}>
          <div className="mainInner">
            <Views/>
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  )
}
