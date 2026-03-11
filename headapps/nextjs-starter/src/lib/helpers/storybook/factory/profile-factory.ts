import { imageFieldArgs, stringFieldArgs } from '../mock';

const PROFILES = [
  {
    id: '899df5ba-801b-4601-9bef-088a7d46ef3b',
    url: '/Settings/Component-Settings/Profiles/Jane-Doe',
    name: 'Jane Doe',
    displayName: 'Jane Doe',
    fields: {
      image: imageFieldArgs(3084, 2313),
      imageMobile: imageFieldArgs(320, 400),
      firstName: stringFieldArgs('Jane'),
      lastName: stringFieldArgs('Doe'),
      email: stringFieldArgs('jane.doe@example.com'),
      role: stringFieldArgs('Designer'),
      description: stringFieldArgs(
        '<span id="docs-internal-guid-7931aeb5-7fff-de53-a489-64801523c64e">Jane Doe is a designer and travel enthusiast, blending creativity with exploration. Her work captures the beauty of diverse cultures and landscapes, inspiring others to see the world differently.&nbsp;<span id="docs-internal-guid-2d32f7ee-7fff-0180-41a3-387fd7a035d4" style="color: #000000;">Through her journeys, she finds endless inspiration, bringing a fresh perspective to every project she undertakes.</span></span>'
      ),
    },
  },
  {
    id: '2c825391-cf0b-471e-9d3c-e8210106fd9b',
    url: '/Settings/Component-Settings/Profiles/John-Doe',
    name: 'John Doe',
    displayName: 'John Doe',
    fields: {
      image: imageFieldArgs(4498, 3000),
      imageMobile: imageFieldArgs(320, 400),
      firstName: stringFieldArgs('John'),
      lastName: stringFieldArgs('Doe'),
      email: stringFieldArgs('john.doe@example.com'),
      role: stringFieldArgs('Developer'),
      description: stringFieldArgs(
        'John Doe is a mysterious figure, often representing the everyman or the unknown in countless narratives. Though his identity remains ambiguous, he symbolizes resilience, adaptability, and the human spirit&rsquo;s quest for purpose. His story is one of countless possibilities, embodying the idea that everyone has a unique journey and untold stories waiting to be shared.'
      ),
    },
  },
  {
    id: '870a22b6-10c3-48de-80ca-c1b65d6c5dcc',
    url: '/Settings/Component-Settings/Profiles/Peter-Parker',
    name: 'Peter Parker',
    displayName: 'Peter Parker',
    fields: {
      image: imageFieldArgs(5472, 3648),
      imageMobile: imageFieldArgs(320, 400),
      firstName: stringFieldArgs('Peter'),
      lastName: stringFieldArgs('Parker'),
      email: stringFieldArgs('pparker@example.com'),
      role: stringFieldArgs('Web Developer'),
      description: stringFieldArgs(
        'Peter Parker is a brilliant yet humble young man, balancing his life as a student, photographer, and New York City`s beloved hero, Spider-Man. Driven by the mantra `With great power comes great responsibility,` he selflessly protects his city from threats big and small. Peter`s journey embodies resilience, compassion, and the strength to persevere despite personal loss, inspiring people everywhere to stand up for what`s right, no matter the odds.'
      ),
    },
  },
];

export const profileFactory = (count = 3) => {
  return Array.from({ length: count }, (_, index) => PROFILES[index]);
};
