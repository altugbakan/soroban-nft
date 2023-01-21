import { Carousel } from "@mantine/carousel";
import { TokenCard, TokenDataType } from "./TokenCard";

export interface TokenCarouselProps {
  tokens: TokenDataType[] | undefined;
}

export function TokenCarousel({ tokens }: TokenCarouselProps) {
  if (!Array.isArray(tokens)) return null;

  const slides = tokens.map((token) => (
    <Carousel.Slide key={token.id}>
      <TokenCard {...token} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize="25%"
      breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: 1 }]}
      slideGap="xl"
      align="start"
      slidesToScroll={1}
      containScroll="trimSnaps"
    >
      {slides}
    </Carousel>
  );
}
