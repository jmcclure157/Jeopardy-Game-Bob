import { Category } from '../types/game';

export interface CategoryWithMeta extends Category {
  topic: string;
  roundType: 'jeopardy' | 'double-jeopardy';
}

export const MASTER_CATEGORY_LIBRARY: CategoryWithMeta[] = [
  // --- SINGLE JEOPARDY CATEGORIES ($200 - $1000) ---
  {
    id: 'lib-j-world-geo',
    name: 'WORLD GEOGRAPHY',
    topic: 'Geography',
    roundType: 'jeopardy',
    clues: [
      { id: 'geo-1', value: 200, clue: 'This South American country has the longest coastline along the Pacific Ocean.', answer: 'Chile', acceptableAnswers: ['Republic of Chile'] },
      { id: 'geo-2', value: 400, clue: 'This European capital city is built across 14 islands on Lake Mälaren and the Baltic Sea.', answer: 'Stockholm', acceptableAnswers: ['Stockholm, Sweden'] },
      { id: 'geo-3', value: 600, clue: 'Lake Victoria, Africa\'s largest lake by area, is shared by Uganda, Kenya, and this country.', answer: 'Tanzania', acceptableAnswers: ['United Republic of Tanzania'] },
      { id: 'geo-4', value: 800, clue: 'This strait separates the South Island of New Zealand from the North Island.', answer: 'Cook Strait', acceptableAnswers: ['The Cook Strait'], isDailyDouble: true },
      { id: 'geo-5', value: 1000, clue: 'Though surrounded by South Africa, this landlocked kingdom is officially called the Kingdom of...', answer: 'Lesotho', acceptableAnswers: ['Kingdom of Lesotho'] }
    ]
  },
  {
    id: 'lib-j-science',
    name: 'SCIENCE & NATURE',
    topic: 'Science',
    roundType: 'jeopardy',
    clues: [
      { id: 'sci-1', value: 200, clue: 'This gas makes up roughly 78% of Earth\'s atmosphere.', answer: 'Nitrogen', acceptableAnswers: ['N2', 'Dinitrogen'] },
      { id: 'sci-2', value: 400, clue: 'The powerhouse organelle of eukaryotic cells, responsible for generating ATP.', answer: 'Mitochondria', acceptableAnswers: ['Mitochondrion'] },
      { id: 'sci-3', value: 600, clue: 'On the Mohs hardness scale of minerals, this mineral ranks as a 10.', answer: 'Diamond', acceptableAnswers: ['Diamonds'] },
      { id: 'sci-4', value: 800, clue: 'This planetary body has the highest surface temperature of any planet in our solar system.', answer: 'Venus', acceptableAnswers: ['Planet Venus'] },
      { id: 'sci-5', value: 1000, clue: 'Named after an Italian physicist, this fundamental particle is a subatomic lepton with no electric charge and near-zero mass.', answer: 'Neutrino', acceptableAnswers: ['Neutrinos'] }
    ]
  },
  {
    id: 'lib-j-novels',
    name: 'FAMOUS NOVELS',
    topic: 'Literature',
    roundType: 'jeopardy',
    clues: [
      { id: 'nov-1', value: 200, clue: 'This 1851 Herman Melville masterpiece begins with the famous line "Call me Ishmael."', answer: 'Moby-Dick', acceptableAnswers: ['Moby Dick', 'The Whale'] },
      { id: 'nov-2', value: 400, clue: 'In this George Orwell dystopian novel, the totalitarian superstate of Oceania is ruled by Big Brother.', answer: '1984', acceptableAnswers: ['Nineteen Eighty-Four', '1984'] },
      { id: 'nov-3', value: 600, clue: 'Holden Caulfield wanders New York City after being expelled from Pencey Prep in this J.D. Salinger classic.', answer: 'The Catcher in the Rye', acceptableAnswers: ['Catcher in the Rye'] },
      { id: 'nov-4', value: 800, clue: 'Set during the Jazz Age on Long Island, this F. Scott Fitzgerald novel centers on Jay and his love for Daisy Buchanan.', answer: 'The Great Gatsby', acceptableAnswers: ['Great Gatsby'] },
      { id: 'nov-5', value: 1000, clue: 'Gabriel García Márquez chronicled seven generations of the Buendía family in this magical realism epic.', answer: 'One Hundred Years of Solitude', acceptableAnswers: ['100 Years of Solitude'] }
    ]
  },
  {
    id: 'lib-j-history',
    name: 'WORLD HISTORY',
    topic: 'History',
    roundType: 'jeopardy',
    clues: [
      { id: 'hist-1', value: 200, clue: 'The Magna Carta was signed by King John of England in this year at Runnymede.', answer: '1215', acceptableAnswers: ['Twelve fifteen', 'Year 1215'] },
      { id: 'hist-2', value: 400, clue: 'This French military leader and Emperor was decisively defeated at the Battle of Waterloo in 1815.', answer: 'Napoleon Bonaparte', acceptableAnswers: ['Napoleon', 'Napoleon I'] },
      { id: 'hist-3', value: 600, clue: 'The ancient wonder known as the Colossus of Rhodes was a giant bronze statue depicting this Greek sun god.', answer: 'Helios', acceptableAnswers: ['Apollo'] },
      { id: 'hist-4', value: 800, clue: 'The Bolsheviks took power in Russia in 1917 under the leadership of this revolutionary theorist.', answer: 'Vladimir Lenin', acceptableAnswers: ['Lenin'] },
      { id: 'hist-5', value: 1000, clue: 'This naval battle in 31 BC between Octavian and Mark Antony & Cleopatra established Rome as an Empire.', answer: 'Battle of Actium', acceptableAnswers: ['Actium'] }
    ]
  },
  {
    id: 'lib-j-movies',
    name: 'SCREEN & SOUND',
    topic: 'Movies & TV',
    roundType: 'jeopardy',
    clues: [
      { id: 'mov-1', value: 200, clue: 'This 1994 film won 6 Academy Awards including Best Picture and starred Tom Hanks running across America.', answer: 'Forrest Gump', acceptableAnswers: ['Forrest Gump'] },
      { id: 'mov-2', value: 400, clue: 'In HBO\'s "Game of Thrones", this House\'s sigil is a golden lion on a crimson field with the motto "Hear Me Roar!".', answer: 'House Lannister', acceptableAnswers: ['Lannister', 'The Lannisters'] },
      { id: 'mov-3', value: 600, clue: 'Composer John Williams scored this iconic 1975 Steven Spielberg thriller about a man-eating great white shark.', answer: 'Jaws', acceptableAnswers: ['Jaws'] },
      { id: 'mov-4', value: 800, clue: 'This animated 2001 film was the very first recipient of the Academy Award for Best Animated Feature.', answer: 'Shrek', acceptableAnswers: ['Shrek 1'] },
      { id: 'mov-5', value: 1000, clue: 'Director Christopher Nolan explored dream architecture and subconscious inception in this 2010 sci-fi blockbuster.', answer: 'Inception', acceptableAnswers: ['Inception'] }
    ]
  },
  {
    id: 'lib-j-streaming',
    name: 'STREAMING HITS',
    topic: 'Movies & TV',
    roundType: 'jeopardy',
    clues: [
      { id: 'str-1', value: 200, clue: 'Eleven and the residents of Hawkins battle the Upside Down in this 80s-inspired Netflix series.', answer: 'Stranger Things', acceptableAnswers: ['Stranger Things'] },
      { id: 'str-2', value: 400, clue: 'Pedro Pascal portrays Joel escorting Ellie across post-apocalyptic America in this HBO adaptation.', answer: 'The Last of Us', acceptableAnswers: ['Last of Us'] },
      { id: 'str-3', value: 600, clue: 'In Netflix\'s hit survival drama from South Korea, contestants compete in deadly children\'s games for 45.6 billion won.', answer: 'Squid Game', acceptableAnswers: ['Squid Game'] },
      { id: 'str-4', value: 800, clue: 'Roy Kent and Coach Beard assist an optimistic American football coach running AFC Richmond in this Apple TV+ comedy.', answer: 'Ted Lasso', acceptableAnswers: ['Ted Lasso'], isDailyDouble: true },
      { id: 'str-5', value: 1000, clue: 'Jeremy Allen White stars as fine-dining chef Carmy Berzatto revitalizing his family sandwich shop in this FX series.', answer: 'The Bear', acceptableAnswers: ['The Bear'] }
    ]
  },
  {
    id: 'lib-j-billboard',
    name: 'BILLBOARD NO. 1S',
    topic: 'Music',
    roundType: 'jeopardy',
    clues: [
      { id: 'bb-1', value: 200, clue: 'This pop icon re-recorded her albums as "Taylor\'s Version" and embarked on the historic Eras Tour.', answer: 'Taylor Swift', acceptableAnswers: ['Taylor Swift'] },
      { id: 'bb-2', value: 400, clue: 'In 1982, this Michael Jackson album produced seven Top 10 singles and remains the best-selling album in history.', answer: 'Thriller', acceptableAnswers: ['Thriller'] },
      { id: 'bb-3', value: 600, clue: 'The Weeknd spent a record-breaking 90 weeks on the Hot 100 with this synth-pop smash hit from "After Hours".', answer: 'Blinding Lights', acceptableAnswers: ['Blinding Lights'] },
      { id: 'bb-4', value: 800, clue: 'This British singer-songwriter swept the Grammy awards with hits like "Rolling in the Deep" and "Hello".', answer: 'Adele', acceptableAnswers: ['Adele Adkins', 'Adele'] },
      { id: 'bb-5', value: 1000, clue: 'This rock band holds the record for the most Billboard Hot 100 number-one hits of all time with 20 tracks.', answer: 'The Beatles', acceptableAnswers: ['Beatles'] }
    ]
  },
  {
    id: 'lib-j-gaming',
    name: 'VIDEO GAME WORLDS',
    topic: 'Pop Culture',
    roundType: 'jeopardy',
    clues: [
      { id: 'vg-1', value: 200, clue: 'Link travels across the realm of Hyrule to rescue Princess Zelda in this legendary Nintendo franchise.', answer: 'The Legend of Zelda', acceptableAnswers: ['Zelda', 'Legend of Zelda'] },
      { id: 'vg-2', value: 400, clue: 'This sandbox block-building game created by Markus "Notch" Persson is the best-selling video game of all time.', answer: 'Minecraft', acceptableAnswers: ['Minecraft'] },
      { id: 'vg-3', value: 600, clue: 'Players drop onto an island, harvest materials, and battle to be the last survivor in this Epic Games battle royale phenomenon.', answer: 'Fortnite', acceptableAnswers: ['Fortnite'] },
      { id: 'vg-4', value: 800, clue: 'Master Chief and Cortana battle the alien Covenant in this flagship Xbox sci-fi franchise.', answer: 'Halo', acceptableAnswers: ['Halo series'] },
      { id: 'vg-5', value: 1000, clue: 'FromSoftware made gaming history in 2022 with this open-world soulslike fantasy RPG set in the Lands Between.', answer: 'Elden Ring', acceptableAnswers: ['Elden Ring'] }
    ]
  },
  {
    id: 'lib-j-sports',
    name: 'SPORTS LEGENDS',
    topic: 'Sports',
    roundType: 'jeopardy',
    clues: [
      { id: 'sp-1', value: 200, clue: 'This Argentine football legend led his national team to victory in the 2022 FIFA World Cup in Qatar.', answer: 'Lionel Messi', acceptableAnswers: ['Messi', 'Leo Messi'] },
      { id: 'sp-2', value: 400, clue: 'This Chicago Bulls shooting guard won 6 NBA championships and two Olympic gold medals with the "Dream Team".', answer: 'Michael Jordan', acceptableAnswers: ['Jordan', 'MJ'] },
      { id: 'sp-3', value: 600, clue: 'This Jamaican sprinter set world records in the 100m (9.58s) and 200m (19.19s).', answer: 'Usain Bolt', acceptableAnswers: ['Bolt'] },
      { id: 'sp-4', value: 800, clue: 'With 23 Grand Slam singles titles in the Open Era, this American tennis superstar dominated women\'s tennis for two decades.', answer: 'Serena Williams', acceptableAnswers: ['Serena'] },
      { id: 'sp-5', value: 1000, clue: 'This quarterback won 7 Super Bowl titles across his careers with the New England Patriots and Tampa Bay Buccaneers.', answer: 'Tom Brady', acceptableAnswers: ['Brady'] }
    ]
  },
  {
    id: 'lib-j-food',
    name: 'FOOD & BEVERAGES',
    topic: 'Food & Drink',
    roundType: 'jeopardy',
    clues: [
      { id: 'fd-1', value: 200, clue: 'This coffee beverage is prepared by diluting espresso with hot water, giving it a similar strength to brewed coffee.', answer: 'Americano', acceptableAnswers: ['Caffe Americano'] },
      { id: 'fd-2', value: 400, clue: 'Originating in Naples, this classic pizza is topped with San Marzano tomatoes, fresh mozzarella, basil, and olive oil.', answer: 'Margherita Pizza', acceptableAnswers: ['Margherita', 'Pizza Margherita'] },
      { id: 'fd-3', value: 600, clue: 'This yellow spice, derived from the Curcuma longa plant, gives curry powders their distinctive golden color.', answer: 'Turmeric', acceptableAnswers: ['Curcuma'] },
      { id: 'fd-4', value: 800, clue: 'This traditional Japanese soup consists of a dashi stock mixed with fermented soybean paste.', answer: 'Miso Soup', acceptableAnswers: ['Miso'] },
      { id: 'fd-5', value: 1000, clue: 'Often considered the most expensive spice in the world, this comes from the dried stigmas of a purple crocus flower.', answer: 'Saffron', acceptableAnswers: ['Saffron'] }
    ]
  },
  {
    id: 'lib-j-brands',
    name: 'ICONIC BRANDS',
    topic: 'Pop Culture',
    roundType: 'jeopardy',
    clues: [
      { id: 'br-1', value: 200, clue: 'This footwear giant\'s famous "Swoosh" logo was designed in 1971 for just $35.', answer: 'Nike', acceptableAnswers: ['Nike Inc'] },
      { id: 'br-2', value: 400, clue: 'Known for its Swedish flat-pack furniture and meatball cafeteria, this retailer was founded by Ingvar Kamprad.', answer: 'IKEA', acceptableAnswers: ['Ikea'] },
      { id: 'br-3', value: 600, clue: 'This electric vehicle and clean energy company was co-founded by Martin Eberhard and Marc Tarpenning, led by Elon Musk.', answer: 'Tesla', acceptableAnswers: ['Tesla Motors', 'Tesla Inc'] },
      { id: 'br-4', value: 800, clue: 'This beverage brand\'s iconic contoured glass bottle was patented in 1915 by the Root Glass Company.', answer: 'Coca-Cola', acceptableAnswers: ['Coke', 'Coca Cola'] },
      { id: 'br-5', value: 1000, clue: 'The name of this LEGO company comes from the Danish phrase "leg godt", which translates to this two-word phrase.', answer: 'Play Well', acceptableAnswers: ['Play well'] }
    ]
  },
  {
    id: 'lib-j-wordplay',
    name: 'WORDPLAY & RHYMES',
    topic: 'Wordplay',
    roundType: 'jeopardy',
    clues: [
      { id: 'wp-1', value: 200, clue: 'A circular pizza dish is topped with deep-pocketed billiard surfaces: Deep Dish...', answer: 'Deep Dish Pizza Pocket', acceptableAnswers: ['Pizza pocket'] },
      { id: 'wp-2', value: 400, clue: 'Apple\'s voice assistant joins forces with a British knight named Elton: Siri...', answer: 'Siri Elton John', acceptableAnswers: ['Siri Elton John'] },
      { id: 'wp-3', value: 600, clue: 'The highest court in the US becomes a supreme Mexican food wrapped in a tortilla: Supreme...', answer: 'Supreme Court Burrito', acceptableAnswers: ['Supreme Court Burrito', 'Supreme Court Taco'] },
      { id: 'wp-4', value: 800, clue: 'The capital of Idaho joins the largest youth scouting organization: Boise...', answer: 'Boise Boy Scouts', acceptableAnswers: ['Boise Boy Scouts'] },
      { id: 'wp-5', value: 1000, clue: 'The famous "Stayin\' Alive" disco brothers produce a honey-filled honeycomb nest: Bee Gees...', answer: 'Bee Gees Beehive', acceptableAnswers: ['Bee Gees Beehive', 'Bee Gees Hive'] }
    ]
  },

  // --- DOUBLE JEOPARDY CATEGORIES ($400 - $2000) ---
  {
    id: 'lib-dj-us-hist',
    name: 'AMERICAN HISTORY',
    topic: 'History',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-ah-1', value: 400, clue: 'Thomas Jefferson completed this landmark land deal with France in 1803, doubling the size of the United States.', answer: 'Louisiana Purchase', acceptableAnswers: ['The Louisiana Purchase'] },
      { id: 'dj-ah-2', value: 800, clue: 'This secret network of safe houses and routes helped enslaved African Americans escape into free states and Canada.', answer: 'Underground Railroad', acceptableAnswers: ['The Underground Railroad'] },
      { id: 'dj-ah-3', value: 1200, clue: 'This 1863 Civil War battle in Pennsylvania is considered the turning point of the war in favor of the Union.', answer: 'Battle of Gettysburg', acceptableAnswers: ['Gettysburg'] },
      { id: 'dj-ah-4', value: 1600, clue: 'In 1920, this Constitutional Amendment granted American women the right to vote.', answer: '19th Amendment', acceptableAnswers: ['Nineteenth Amendment', '19th Amendment'], isDailyDouble: true },
      { id: 'dj-ah-5', value: 2000, clue: 'President Franklin D. Roosevelt signed this landmark act in 1935 creating unemployment insurance and old-age pensions.', answer: 'Social Security Act', acceptableAnswers: ['Social Security'] }
    ]
  },
  {
    id: 'lib-dj-space',
    name: 'SPACE & ASTRONOMY',
    topic: 'Science',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-sp-1', value: 400, clue: 'The nearest major spiral galaxy to our own Milky Way galaxy.', answer: 'Andromeda', acceptableAnswers: ['Andromeda Galaxy', 'M31'] },
      { id: 'dj-sp-2', value: 800, clue: 'Launched in 2021, this advanced space telescope succeeded the Hubble Space Telescope as NASA\'s flagship observatory.', answer: 'James Webb Space Telescope', acceptableAnswers: ['JWST', 'James Webb'] },
      { id: 'dj-sp-3', value: 1200, clue: 'The boundary around a black hole beyond which no light or radiation can escape is called this.', answer: 'Event Horizon', acceptableAnswers: ['The Event Horizon'] },
      { id: 'dj-sp-4', value: 1600, clue: 'Jupiter\'s moon Io is famous for being volcanically active, while this icy moon is believed to harbor a subsurface ocean.', answer: 'Europa', acceptableAnswers: ['Europa'] },
      { id: 'dj-sp-5', value: 2000, clue: 'This theoretical cloud of icy planetesimals situated far beyond Pluto is considered the source of most long-period comets.', answer: 'Oort Cloud', acceptableAnswers: ['The Oort Cloud'], isDailyDouble: true }
    ]
  },
  {
    id: 'lib-dj-capitals',
    name: 'CAPITALS OF THE WORLD',
    topic: 'Geography',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-cap-1', value: 400, clue: 'This capital of Canada was chosen by Queen Victoria in 1857.', answer: 'Ottawa', acceptableAnswers: ['Ottawa, Ontario'] },
      { id: 'dj-cap-2', value: 800, clue: 'Located on the River Tagus, this is the westernmost capital city on the European mainland.', answer: 'Lisbon', acceptableAnswers: ['Lisbon, Portugal', 'Lisboa'] },
      { id: 'dj-cap-3', value: 1200, clue: 'This planned city replaced Rio de Janeiro as the national capital of Brazil in 1960.', answer: 'Brasília', acceptableAnswers: ['Brasilia'] },
      { id: 'dj-cap-4', value: 1600, clue: 'Home to the Burj Khalifa, the UAE\'s most populous city is Dubai, but its official federal capital is this city.', answer: 'Abu Dhabi', acceptableAnswers: ['Abu Dhabi'] },
      { id: 'dj-cap-5', value: 2000, clue: 'At over 3,600 meters above sea level, this city is the highest administrative national capital in the world.', answer: 'La Paz', acceptableAnswers: ['La Paz, Bolivia', 'Sucre'] }
    ]
  },
  {
    id: 'lib-dj-art-music',
    name: 'CLASSICAL ART & MUSIC',
    topic: 'Music',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-art-1', value: 400, clue: 'Leonardo da Vinci painted this iconic portrait in the early 16th century, currently hanging in the Louvre Museum.', answer: 'Mona Lisa', acceptableAnswers: ['The Mona Lisa', 'La Gioconda'] },
      { id: 'dj-art-2', value: 800, clue: 'Ludwig van Beethoven famously incorporated Friedrich Schiller\'s poem "Ode to Joy" into this final symphony of his.', answer: 'Ninth Symphony', acceptableAnswers: ['Symphony No. 9', 'Beethoven\'s Ninth', '9th Symphony'] },
      { id: 'dj-art-3', value: 1200, clue: 'This Dutch Post-Impressionist painted "The Starry Night" while staying at the Saint-Paul-de-Mausole asylum.', answer: 'Vincent van Gogh', acceptableAnswers: ['Van Gogh', 'Vincent Willem van Gogh'] },
      { id: 'dj-art-4', value: 1600, clue: 'Antonio Vivaldi composed this series of four violin concertos, each depicting a different time of year.', answer: 'The Four Seasons', acceptableAnswers: ['Four Seasons', 'Le quattro stagioni'] },
      { id: 'dj-art-5', value: 2000, clue: 'This Italian sculptor crafted the famous Marble Pieta in St. Peter\'s Basilica and the David in Florence.', answer: 'Michelangelo', acceptableAnswers: ['Michelangelo Buonarroti'] }
    ]
  },
  {
    id: 'lib-dj-mythology',
    name: 'MYTHOLOGY & LEGENDS',
    topic: 'History',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-myth-1', value: 400, clue: 'In Norse mythology, this Allfather god traded one of his eyes at Mimir\'s Well in exchange for cosmic wisdom.', answer: 'Odin', acceptableAnswers: ['Woden', 'Wotan'] },
      { id: 'dj-myth-2', value: 800, clue: 'According to Greek mythology, this hero completed 12 labors, starting with slaying the Nemean Lion.', answer: 'Hercules', acceptableAnswers: ['Heracles', 'Herakles'] },
      { id: 'dj-myth-3', value: 1200, clue: 'In Egyptian mythology, this jackal-headed god is the deity of mummification and the guide of souls to the afterlife.', answer: 'Anubis', acceptableAnswers: ['Anpu'] },
      { id: 'dj-myth-4', value: 1600, clue: 'King Arthur pulled this enchanted sword from the stone, though other tales say it was given to him by the Lady of the Lake.', answer: 'Excalibur', acceptableAnswers: ['Caliburn', 'Excalibur'] },
      { id: 'dj-myth-5', value: 2000, clue: 'In Roman mythology, she was the goddess of love and beauty, the mother of Cupid, and equivalent to Greek Aphrodite.', answer: 'Venus', acceptableAnswers: ['Venus'] }
    ]
  },
  {
    id: 'lib-dj-inventions',
    name: 'TECH & INVENTIONS',
    topic: 'Science',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dj-tech-1', value: 400, clue: 'British engineer Tim Berners-Lee invented this system in 1989 while working at CERN.', answer: 'World Wide Web', acceptableAnswers: ['WWW', 'The Web', 'The World Wide Web'] },
      { id: 'dj-tech-2', value: 800, clue: 'This Scottish scientist discovered penicillin in 1928, ushering in the age of modern antibiotics.', answer: 'Alexander Fleming', acceptableAnswers: ['Sir Alexander Fleming', 'Fleming'] },
      { id: 'dj-tech-3', value: 1200, clue: 'In 1969, the first message ever sent across this predecessor of the modern Internet was "LO".', answer: 'ARPANET', acceptableAnswers: ['ARPAnet', 'Advanced Research Projects Agency Network'] },
      { id: 'dj-tech-4', value: 1600, clue: 'Alan Turing designed an electro-mechanical machine called the Bombe to decipher messages encrypted by this German cipher device.', answer: 'Enigma Machine', acceptableAnswers: ['Enigma', 'The Enigma'] },
      { id: 'dj-tech-5', value: 2000, clue: 'The first commercial solid-state transistor was invented in 1947 at this renowned New Jersey research laboratory.', answer: 'Bell Labs', acceptableAnswers: ['Bell Laboratories', 'AT&T Bell Labs'] }
    ]
  },
  {
    id: 'lib-dj-oscars',
    name: 'OSCAR WINNERS',
    topic: 'Movies & TV',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'djo-1', value: 400, clue: 'This 1997 James Cameron epic tied the record for most Oscars won by a single film with 11 trophies.', answer: 'Titanic', acceptableAnswers: ['Titanic'] },
      { id: 'djo-2', value: 800, clue: 'Bong Joon-ho\'s 2019 black comedy thriller became the first non-English language film to win Best Picture.', answer: 'Parasite', acceptableAnswers: ['Parasite'] },
      { id: 'djo-3', value: 1200, clue: 'Daniel Day-Lewis won three Academy Awards for Best Actor, including for his portrayal of this 16th US President.', answer: 'Abraham Lincoln', acceptableAnswers: ['Lincoln'] },
      { id: 'djo-4', value: 1600, clue: 'This 2023 Christopher Nolan biographical drama about the father of the atomic bomb won 7 Oscars including Best Picture.', answer: 'Oppenheimer', acceptableAnswers: ['Oppenheimer'], isDailyDouble: true },
      { id: 'djo-5', value: 2000, clue: 'Only three movies in Oscar history swept the "Big Five" awards: "It Happened One Night", "One Flew Over the Cuckoo\'s Nest", and this 1991 psychological thriller.', answer: 'The Silence of the Lambs', acceptableAnswers: ['Silence of the Lambs'] }
    ]
  },
  {
    id: 'lib-dj-internet',
    name: 'INTERNET & SOCIAL MEDIA',
    topic: 'Pop Culture',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'dji-1', value: 400, clue: 'The first video ever uploaded to YouTube in April 2005 was titled "Me at the..." what location?', answer: 'Zoo', acceptableAnswers: ['The zoo', 'San Diego Zoo'] },
      { id: 'dji-2', value: 800, clue: 'This short-form video sharing platform originated from the Chinese app Douyin created by ByteDance.', answer: 'TikTok', acceptableAnswers: ['Tik Tok'] },
      { id: 'dji-3', value: 1200, clue: 'Reddit users call the main discussion boards on the platform by this name, prefixed with "r/".', answer: 'Subreddits', acceptableAnswers: ['Subreddit', 'Sub-reddit'] },
      { id: 'dji-4', value: 1600, clue: 'In 2022, Elon Musk acquired Twitter and rebranded the social media platform to this single letter.', answer: 'X', acceptableAnswers: ['X.com', 'Letter X'] },
      { id: 'dji-5', value: 2000, clue: 'This online open-content encyclopedia was launched on January 15, 2001 by Jimmy Wales and Larry Sanger.', answer: 'Wikipedia', acceptableAnswers: ['Wikipedia'], isDailyDouble: true }
    ]
  },
  {
    id: 'lib-dj-superheroes',
    name: 'SUPERHERO CINEMA',
    topic: 'Movies & TV',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'djs-1', value: 400, clue: 'Robert Downey Jr. kicked off the Marvel Cinematic Universe in 2008 playing this genius billionaire industrialist.', answer: 'Tony Stark', acceptableAnswers: ['Iron Man', 'Tony Stark / Iron Man'] },
      { id: 'djs-2', value: 800, clue: 'Chadwick Boseman portrayed King T\'Challa, the protector of the fictional African kingdom of Wakanda in this 2018 smash hit.', answer: 'Black Panther', acceptableAnswers: ['Black Panther'] },
      { id: 'djs-3', value: 1200, clue: 'Heath Ledger posthumously won an Oscar for playing this villain in Christopher Nolan\'s "The Dark Knight".', answer: 'The Joker', acceptableAnswers: ['Joker'] },
      { id: 'djs-4', value: 1600, clue: 'This metal alloy coats Wolverine\'s skeleton and claws in the Marvel Comics universe.', answer: 'Adamantium', acceptableAnswers: ['Adamantium metal'] },
      { id: 'djs-5', value: 2000, clue: 'In the DC Extended Universe, this Amazonian warrior princess is portrayed by Gal Gadot.', answer: 'Wonder Woman', acceptableAnswers: ['Diana Prince', 'Wonder Woman'] }
    ]
  },
  {
    id: 'lib-dj-olympics',
    name: 'OLYMPIC HISTORY',
    topic: 'Sports',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'djo-1b', value: 400, clue: 'With 28 total Olympic medals (23 gold), this American swimmer is the most decorated Olympian of all time.', answer: 'Michael Phelps', acceptableAnswers: ['Phelps'] },
      { id: 'djo-2b', value: 800, clue: 'The modern Olympic Games were revived in 1896 and hosted in this historic Greek capital city.', answer: 'Athens', acceptableAnswers: ['Athens, Greece'] },
      { id: 'djo-3b', value: 1200, clue: 'The five interlocking Olympic rings represent the five inhabited continents; their colors are blue, yellow, black, red, and this color.', answer: 'Green', acceptableAnswers: ['Green ring'] },
      { id: 'djo-4b', value: 1600, clue: 'At the 1936 Berlin Olympics, this African American track star famously won four gold medals.', answer: 'Jesse Owens', acceptableAnswers: ['Owens'] },
      { id: 'djo-5b', value: 2000, clue: 'This city hosted the 2024 Summer Olympics, holding the opening ceremony along the River Seine.', answer: 'Paris', acceptableAnswers: ['Paris, France'] }
    ]
  },
  {
    id: 'lib-dj-broadway',
    name: 'BROADWAY & THEATER',
    topic: 'Music',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'djb-1', value: 400, clue: 'Lin-Manuel Miranda created and starred in this hip-hop musical about America\'s first Secretary of the Treasury.', answer: 'Hamilton', acceptableAnswers: ['Alexander Hamilton'] },
      { id: 'djb-2', value: 800, clue: 'This Andrew Lloyd Webber musical based on T.S. Eliot poems features the famous ballad "Memory".', answer: 'Cats', acceptableAnswers: ['Cats the musical'] },
      { id: 'djb-3', value: 1200, clue: 'Set in Paris during the Belle Époque, this musical tells the tragic romance between Christian and the courtesan Satine.', answer: 'Moulin Rouge!', acceptableAnswers: ['Moulin Rouge', 'Moulin Rouge! The Musical'] },
      { id: 'djb-4', value: 1600, clue: 'Idina Menzel and Kristin Chenoweth originated the roles of Elphaba and Glinda in this "Wizard of Oz" prequel.', answer: 'Wicked', acceptableAnswers: ['Wicked'] },
      { id: 'djb-5', value: 2000, clue: 'This longest-running show in Broadway history concluded its 35-year run at the Majestic Theatre in 2023.', answer: 'The Phantom of the Opera', acceptableAnswers: ['Phantom of the Opera'] }
    ]
  },
  {
    id: 'lib-dj-quotes',
    name: 'FAMOUS QUOTES',
    topic: 'Pop Culture',
    roundType: 'double-jeopardy',
    clues: [
      { id: 'djq-1', value: 400, clue: '"May the Force be with you" is the signature greeting from this galaxy-spanning space franchise.', answer: 'Star Wars', acceptableAnswers: ['Star Wars'] },
      { id: 'djq-2', value: 800, clue: '"Here\'s looking at you, kid" is spoken by Humphrey Bogart to Ingrid Bergman in this 1942 wartime classic.', answer: 'Casablanca', acceptableAnswers: ['Casablanca'] },
      { id: 'djq-3', value: 1200, clue: 'Neil Armstrong spoke the immortal line "That\'s one small step for man, one giant leap for mankind" upon stepping on this body.', answer: 'The Moon', acceptableAnswers: ['Moon', 'Lunar surface'] },
      { id: 'djq-4', value: 1600, clue: '"I\'ll make him an offer he can\'t refuse" is uttered by Marlon Brando as Don Vito Corleone in this crime masterpiece.', answer: 'The Godfather', acceptableAnswers: ['The Godfather Part 1', 'Godfather'] },
      { id: 'djq-5', value: 2000, clue: '"Houston, we have a problem" is famously associated with this ill-fated 1970 lunar mission.', answer: 'Apollo 13', acceptableAnswers: ['Apollo 13 mission'] }
    ]
  }
];
