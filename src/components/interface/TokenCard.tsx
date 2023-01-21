import { createStyles, Paper, Title } from "@mantine/core";

export type TokenDataType = {
  uri: string;
  owner?: string;
  id: number | string;
  name?: string;
};

const useStyles = createStyles((theme) => ({
  card: {
    height: 400,
    width: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 9.5,
    marginTop: theme.spacing.xs,
  },

  id: {
    color: theme.white,
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
}));

export function TokenCard({ uri, owner, id, name }: TokenDataType) {
  const { classes } = useStyles();

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${uri})` }}
      className={classes.card}
    >
      <div>
        <Title order={3} className={classes.title}>
          {owner}
        </Title>
      </div>
      <div className={classes.id}>
        {typeof id == "number" ? <p>{`Token No: ${id}`}</p> : <p>{id}</p>}
        {<p>{name}</p>}
      </div>
    </Paper>
  );
}
