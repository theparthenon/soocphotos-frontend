import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import navigationConfig from "@/configs/navigation.config";
import {Group, Menu, ActionIcon, AppShell} from "@mantine/core";
import SideBarBottomContent from "@/components/Layout/Theme/SideBarBottomContent";
import { IconChevronRight as ChevronRight } from '@tabler/icons-react';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('');


  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setActive(currentPath);
  }, [location.pathname]);

  const links = navigationConfig.map((item) => {
    const link = (
      <a
        key={item.key}
        className="link"
        data-active={item.path.split('/')[1] === active ? 'true' : undefined}
        onClick={(event) => {
          event.preventDefault();
          if (!item.subMenu) {
            setActive(item.path.split('/')[1]);
            navigate(item.path);
          }
        }}
      >
        <ActionIcon component="span" className="linkIcon" color={item.color} variant="light">
          <item.icon />
        </ActionIcon>
        <span style={{ flexGrow: 2 }}>{item.title}</span>
        {item.subMenu && <ChevronRight size={16} />}
      </a>
    );

    if (item.subMenu) {
      return (
        <Menu key={item.key} withArrow position="right-start" width={200}>
          <Menu.Target>{link}</Menu.Target>

          <Menu.Dropdown>
            {item.subMenu.map(subitem => {
              const idx = item.subMenu?.indexOf(subitem);

              if (subitem.type === 'title') {
                return <Menu.Label key={idx}>{subitem.title}</Menu.Label>;
              }

              if (subitem.type === 'divider') {
                return <Menu.Divider key={idx} />;
              }

              const icon = (
                <ActionIcon component="span" color={subitem.color} variant="light">
                  <subitem.icon />
                </ActionIcon>
              );

              return (
                <Menu.Item
                  key={idx}
                  component="a"
                  onClick={(event) => {
                    event.preventDefault();
                    setActive(subitem.path.split('/')[1]);
                    navigate(subitem.path);
                  }}
                  leftSection={icon}>
                  {subitem.title}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return link;
  });

  return (
    <AppShell.Navbar zIndex={200} className="navbar">
        {links}
        <div className="footer">
          <SideBarBottomContent/>
        </div>
    </AppShell.Navbar>
  );
}