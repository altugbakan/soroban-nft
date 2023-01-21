import {
  createStyles,
  Menu,
  Group,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { IconChevronDown, IconSun, IconMoon } from "@tabler/icons";
import WalletButton from "../interface/WalletButton";

const useStyles = createStyles((theme) => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: "140px",
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

export function ConnectionMenu() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, theme } = useStyles();

  const menuIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 5 : 6];

  const getIcon = () => {
    return colorScheme === "dark" ? (
      <IconSun size={16} stroke={1.5} color={menuIconColor} />
    ) : (
      <IconMoon size={16} stroke={1.5} color={menuIconColor} />
    );
  };

  return (
    <Group noWrap spacing={0}>
      <WalletButton className={classes.button} />
      <Menu transition="pop" position="bottom-end">
        <Menu.Target>
          <ActionIcon
            variant="filled"
            color={theme.primaryColor}
            size={36}
            className={classes.menuControl}
          >
            <IconChevronDown size={16} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={getIcon()} onClick={() => toggleColorScheme()}>
            {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
