import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';
import { Image, Stack, useMantineColorScheme } from '@mantine/core';

function HowToPlaySlide({
  title,
  imageSrc,
  lightHidden,
  darkHidden,
  imgMx,
}: {
  title: string;
  imageSrc: string;
  lightHidden?: boolean;
  darkHidden?: boolean;
  imgMx?: string;
}) {
  return (
    <Carousel.Slide lightHidden={lightHidden} darkHidden={darkHidden}>
      <Stack justify="space-between" align="center">
        <h2>{title}</h2>
        <Image
          radius="xl"
          src={imageSrc}
          alt={title}
          h={170}
          fit="contain"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </Stack>
    </Carousel.Slide>
  );
}

export function HowToPlay() {
  const { colorScheme } = useMantineColorScheme();
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  return (
    <>
      <Carousel
        withIndicators
        height={300}
        emblaOptions={{
          loop: true,
          dragFree: false,
          align: 'center',
        }}
        ta={'center'}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
      >
        {colorScheme === 'light' ? (
          <HowToPlaySlide
            title="Join or Create a Lobby"
            imageSrc="/src/components/HowToPlay/welcomeCardLight.png"
          />
        ) : (
          <HowToPlaySlide
            title="Join or Create a Lobby"
            imageSrc="/src/components/HowToPlay/welcomeCard.png"
          />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide
            title="Choose Lobby Settings"
            imageSrc="/src/components/HowToPlay/LobbySettingsLight.png"
          />
        ) : (
          <HowToPlaySlide
            title="Choose Lobby Settings"
            imageSrc="/src/components/HowToPlay/LobbySettings.png"
          />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide
            title="Ready Up and Start the Game"
            imageSrc="/src/components/HowToPlay/playerStackLight.png"
          />
        ) : (
          <HowToPlaySlide
            title="Ready Up and Start the Game"
            imageSrc="/src/components/HowToPlay/playerStack.png"
          />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide
            title="Submit your Phrase Each Round"
            imageSrc="/src/components/HowToPlay/gameLight.png"
          />
        ) : (
          <HowToPlaySlide
            title="Submit your Phrase Each Round"
            imageSrc="/src/components/HowToPlay/game.png"
          />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide
            title="Explore the Results"
            imageSrc="/src/components/HowToPlay/resultsTableLight.png"
          />
        ) : (
          <HowToPlaySlide
            title="Explore the Results"
            imageSrc="/src/components/HowToPlay/resultsTable.png"
          />
        )}
      </Carousel>
    </>
  );
}
