import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  logo: {
    fill: theme.colorScheme === "dark" ? theme.white : theme.black,
    stroke: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

export function SorobanLogo() {
  const { classes } = useStyles();

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 87 87"
      className={classes.logo}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.4899 51.5401L60.4386 75.455C52.9645 79.7192 42.1089 79.3509 35.2189 74.35L11.8135 57.3619C9.59862 55.7542 9.59862 53.1478 11.8135 51.5401C16.1424 48.3981 23.161 48.3981 27.4899 51.5401Z"
        strokeWidth="4"
      />
      <path
        d="M46.6766 13.0079L70.082 29.9961C72.2969 31.6037 72.2969 34.2102 70.082 35.8178C65.7531 38.9598 58.7346 38.9598 54.4056 35.8178L21.457 11.903C28.9311 7.63864 39.7866 8.00695 46.6766 13.0079Z"
        strokeWidth="4"
      />
      <path
        d="M65.4574 70.0887L17.6095 35.3597C10.7196 30.3588 10.2121 22.4796 16.0872 17.0547L63.9351 51.7838C70.825 56.7846 71.3325 64.6639 65.4574 70.0887Z"
        strokeWidth="4"
      />
    </svg>
  );
}
