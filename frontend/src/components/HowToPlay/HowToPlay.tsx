import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';
import { Image, Stack, Text, useMantineColorScheme } from '@mantine/core';
import game from '@/assets/game.png';
import gameLight from '@/assets/gameLight.png';
import lobbySettings from '@/assets/LobbySettings.png';
import lobbySettingsLight from '@/assets/lobbySettingsLight.png';
import playerStack from '@/assets/playerStack.png';
import playerStackLight from '@/assets/playerStackLight.png';
import resultsTable from '@/assets/resultsTable.png';
import resultsTableLight from '@/assets/resultsTableLight.png';
import welcomeCard from '@/assets/welcomeCard.png';
import welcomeCardLight from '@/assets/welcomeCardLight.png';

function HowToPlaySlide({
  title,
  imageSrc,
  lightHidden,
  darkHidden,
}: {
  title: string;
  imageSrc: string;
  lightHidden?: boolean;
  darkHidden?: boolean;
}) {
  return (
    <Carousel.Slide lightHidden={lightHidden} darkHidden={darkHidden}>
      <Stack justify="space-between" align="center">
        <Text style={{ marginTop: '10px', marginBottom: '0px' }} size="xl">
          {title}
        </Text>
        <Image
          radius="xl"
          src={imageSrc}
          alt={title}
          h={250}
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
        emblaOptions={{
          loop: true,
          dragFree: false,
          align: 'center',
        }}
        ta="center"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        pb="xl"
        px="xl"
      >
        {colorScheme === 'light' ? (
          <HowToPlaySlide title="Join or Create a Lobby" imageSrc={welcomeCardLight} />
        ) : (
          <HowToPlaySlide title="Join or Create a Lobby" imageSrc={welcomeCard} />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide title="Choose Lobby Settings" imageSrc={lobbySettingsLight} />
        ) : (
          <HowToPlaySlide title="Choose Lobby Settings" imageSrc={lobbySettings} />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide title="Ready Up and Start the Game" imageSrc={playerStackLight} />
        ) : (
          <HowToPlaySlide title="Ready Up and Start the Game" imageSrc={playerStack} />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide title="Submit your Phrase Each Round" imageSrc={gameLight} />
        ) : (
          <HowToPlaySlide title="Submit your Phrase Each Round" imageSrc={game} />
        )}
        {colorScheme === 'light' ? (
          <HowToPlaySlide title="Explore the Results" imageSrc={resultsTableLight} />
        ) : (
          <HowToPlaySlide title="Explore the Results" imageSrc={resultsTable} />
        )}
      </Carousel>
    </>
  );
}
