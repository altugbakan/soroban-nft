import { createStyles, Container, Group, ActionIcon } from "@mantine/core";
import { IconBrandTwitter, IconBrandGithub, IconWorld } from "@tabler/icons";
import { SorobanLogo } from "./SorobanLogo";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    bottom: 0,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },

  anchor: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:visited": {
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    },
  },
}));

export function Footer() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group spacing={4} position="left" noWrap>
          <SorobanLogo />
          <h4>
            Created for{" "}
            <a
              href="https://devpost.com/software/sorodogs"
              target="_blank"
              rel="noreferrer"
              className={classes.anchor}
            >
              Hacka-Soroban-athon
            </a>
          </h4>
        </Group>
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <ActionIcon
            size="lg"
            onClick={() => window.open("https://alt.ug/", "_blank")}
          >
            <IconWorld size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            onClick={() =>
              window.open("https://github.com/altugbakan/sorodogs/", "_blank")
            }
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            onClick={() =>
              window.open("https://twitter.com/altugbakan/", "_blank")
            }
          >
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
