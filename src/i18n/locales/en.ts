/* ════════════════════════════════════════════════════════════════
   Locale bundle: English
   ────────────────────────────────────────────────────────────────
   A first English pass of all user-facing copy. The classical quotes use
   widely-accepted public-domain English renderings; wording can be tuned.
   To add another language, copy this file, change `code`/`name`/`html`, and
   translate the values — the loader picks it up automatically.
   ════════════════════════════════════════════════════════════════ */

import type { LocaleBundle } from "../messages";

const bundle: LocaleBundle = {
  code: "en",
  name: "English",
  html: "en",
  messages: {
    threshold: {
      title: "Lantern Tide",
      tagline:
        "A silent observer of the shifting tides, distilling the weight of the deep into a single steady light.",
      enter: "Enter",
      enterAria: "Walk through the tunnel and enter",
      skip: "Skip the animation",
    },
    colophon: {
      note: "This island is a lantern lit on a single passing thought, while it was still glowing — a piece of vibe coding, made only to let the idea shine first, not a finished or careful work. Its words and contents may be inaccurate or unverified; take it as a small light drifting in on the tide, not a source to rely on.",
      source: "Source on GitHub",
      show: "About this island",
      close: "Close",
    },
    motion: {
      toggle: "Detailed motion",
      detailed: "Detailed",
      simple: "Simple",
    },
    version: {
      label: "Version",
      commit: "Commit",
      notes: "Release notes",
    },
    nav: {
      backToStreet: "← Back to the street",
      setOut: "Set out again",
    },
    street: {
      label: "Haven · The island street",
      title: "A World Apart",
      note: "(A little street on the haven island. Shops line it — push a door to step in.)",
      empty: "Empty storefront · Coming soon",
      library: "Library · Look it up, fill back up",
      cafe: "Café · Sit a while, think",
      lookout: "Lookout · Gaze, find your bearings",
      paperboat: "Paper-Boat Shop · Fold one, let it go",
      stillroom: "Stillroom · Breathe, and settle",
    },
    lookout: {
      ariaLabel: "The Lookout",
      label: "Lookout · The legend",
      title: "The Lookout",
      hint: "(Tap to hear the next line)",
      story: [
        "Long ago, this island had no name, and those at sea could not find their way home.",
        "On the island lived a girl who climbed the highest rock each night, to keep a lamp lit for those not yet home from the sea.",
        "Some laughed at her: “The sea is so wide — one lamp, who could ever see it?”",
        "She didn't answer; she only held the lamp higher — night after night.",
        "In time she grew old, and could climb no more. So the villagers built her a terrace on the high ground.",
        "That was the first lookout; and the lamp upon it has never gone dark since.",
        "They say that the night she left, its flame became a star in the sky, settling due north.",
        "From then on, any lost ship that knew that star could find its way to this island.",
        "And the island's tide learned from her too: it rises, it withdraws — yet always returns.",
        "So people say: those who put to sea do not leave; they set out on a long voyage.",
        "Weary and worn, follow the lamp on the terrace and the star in the sky, and the tide will carry you home.",
        "— So this lamp, too, we keep burning for you, on and on.",
      ],
    },
    paperboat: {
      ariaLabel: "Paper-Boat Shop",
      label: "Paper-Boat Shop · Fold one, let it go",
      lore: "They say that if you fold a paper boat and set it on the tide, the tide will carry your cares off to somewhere unseen.",
      prompt: "What would you set down? Write it, or pick a direction.",
      inputPlaceholder: "Write what you'd set down…",
      inputAria: "What you'd set down",
      changeDirection: "← Change direction",
      launch: "Fold it, set it on the tide",
      foldAnother: "Fold another",
      fallbackWish: "Something you can't put into words",
      directions: {
        grief: {
          dir: "Grief",
          items: [
            "A time you can't return to",
            "Someone who left",
            "A goodbye never said",
          ],
        },
        anxiety: {
          dir: "Anxiety",
          items: [
            "Tomorrow's uncertainty",
            "A storm that hasn't passed",
            "The fear of being too late",
          ],
        },
        anger: {
          dir: "Anger",
          items: [
            "Something you want to forgive",
            "Words that once hurt you",
            "A grudge you can't release",
          ],
        },
        guilt: {
          dir: "Guilt",
          items: [
            "Something you regret",
            "A sorry that came too late",
            "Being too hard on yourself",
          ],
        },
        weariness: {
          dir: "Weariness",
          items: [
            "Today's tiredness",
            "An expectation too heavy",
            "Holding strong for too long",
          ],
        },
        studies: {
          dir: "Studies",
          items: [
            "A grade you bombed",
            "Endless comparison with peers",
            "A syllabus you can't finish",
          ],
        },
        work: {
          dir: "Work",
          items: [
            "Work that never ends",
            "Effort no one noticed",
            "A difficult coworker",
          ],
        },
        relationships: {
          dir: "Relationships",
          items: [
            "A friendship drifting apart",
            "The strain of pleasing everyone",
            "A quarrel never made up",
          ],
        },
      },
      closings: {
        grief: {
          gone: "The tide has gently taken it.",
          cheer:
            "Keep the longing if you like — but your steps can move forward now.",
        },
        anxiety: {
          gone: "It drifts off with the tide.",
          cheer: "Tomorrow isn't here yet; just walk today through, gently.",
        },
        anger: {
          gone: "Let the tide carry it away for you.",
          cheer: "An open hand frees the strength to move on.",
        },
        guilt: {
          gone: "What's past, hand it to the sea.",
          cheer: "You did your best; carry that knowing, and keep going.",
        },
        weariness: {
          gone: "Set it down; the tide will carry it a while for you.",
          cheer:
            "Rest as long as you need before going on — the pace is yours.",
        },
        studies: {
          gone: "This one, hand it to the sea for now.",
          cheer: "One grade isn't the end; the road ahead is long.",
        },
        work: {
          gone: "Let it go with the tide; you needn't carry it.",
          cheer: "Your effort counts; take it with you, and keep going.",
        },
        relationships: {
          gone: "Some bonds, the tide will keep gently for you.",
          cheer:
            "Look after yourself first; walk on, and you'll meet the right people.",
        },
        default: {
          gone: "The tide has taken it.",
          cheer: "A little lighter now — carry that lightness, and walk on.",
        },
      },
    },
    cafe: {
      ariaLabel: "Café",
      label: "Café · Sit a while, think",
      next: "Another thought",
      prompts: [
        {
          question: "Are you pushed along by life, or are you the one rowing?",
          quote:
            "If a man knows not to which port he is sailing, no wind is favourable.",
          author: "Seneca, Letters to Lucilius",
        },
        {
          question: "Is it the storm you fear, or your fear of the storm?",
          quote:
            "The fisherman knows the sea is dangerous and the storm terrible, but he has never found these dangers reason enough to stay ashore. Give me reality, give me the danger itself.",
          author: "Vincent van Gogh, letter to his brother Theo (1882)",
        },
        {
          question: "When you rest, is it to escape, or to set sail again?",
          quote:
            "I am not afraid of storms, for I am learning how to sail my ship.",
          author: "Louisa May Alcott, Little Women",
        },
        {
          question: "If the storm will never pass, would you still set out?",
          quote:
            "For the ideal that is dear to my heart, I would not regret a thousand deaths to die.",
          author: "Qu Yuan, 'Li Sao'",
        },
        {
          question:
            "Can you tell what you can change from what you can only endure?",
          quote:
            "People are disturbed not by things, but by the views they take of them.",
          author: "Epictetus, Enchiridion",
        },
        {
          question: "When nothing can be changed, what can you still change?",
          quote:
            "Some things are within our power, and some are not — to know the difference is the start of freedom.",
          author: "Epictetus, Enchiridion",
        },
        {
          question:
            "Would you be the headland the waves break on, that stands unmoved?",
          quote:
            "Be like the headland on which the waves continually break; it stands firm, and the seething waters around it are stilled.",
          author: "Marcus Aurelius, Meditations 4.49",
        },
        {
          question:
            "Of the suffering you bear, how much is real, and how much imagined?",
          quote: "We suffer more often in imagination than in reality.",
          author: "Seneca, Letters to Lucilius",
        },
        {
          question: "What is worth bearing any kind of life for?",
          quote: "He who has a why to live can bear almost any how.",
          author: "Nietzsche, Twilight of the Idols",
        },
        {
          question: "Could the very thing blocking you be the way itself?",
          quote:
            "The impediment to action advances action. What stands in the way becomes the way.",
          author: "Marcus Aurelius, Meditations 5.20",
        },
        {
          question:
            "Is your calm from having no storms, or from learning to be with them?",
          quote:
            "Be content with the moment, and willing to follow the flow; then neither sorrow nor joy can enter.",
          author: "Zhuangzi, 'The Secret of Caring for Life'",
        },
        {
          question: "What will grow from the chaos within you?",
          quote:
            "You must still have chaos within you to give birth to a dancing star.",
          author: "Nietzsche, Thus Spoke Zarathustra",
        },
        {
          question:
            "If this moment returned again and again, how would you live it?",
          quote:
            "Live in such a way that you would be willing to live this same life over and over again.",
          author: "Nietzsche, The Gay Science",
        },
        {
          question:
            "Are you waiting for the wind to drop, or learning to sail?",
          quote:
            "You cannot cross the sea merely by standing and staring at the water.",
          author: "Rabindranath Tagore, Stray Birds",
        },
        {
          question:
            "You can't step in the same river twice — what will you carry, and what set down?",
          quote: "No man ever steps in the same river twice.",
          author: "Heraclitus",
        },
        {
          question:
            "Is real strength not being broken, or growing anew after you break?",
          quote: "What does not kill me makes me stronger.",
          author: "Nietzsche, Twilight of the Idols",
        },
        {
          question:
            "What you take for weakness — could it be another kind of strength?",
          quote:
            "Nothing in the world is softer than water, yet nothing is better at overcoming the hard and strong.",
          author: "Laozi, Tao Te Ching, ch. 78",
        },
        {
          question:
            "Having walked through the bleakness, who do you want to become?",
          quote:
            "Looking back to where I came through wind and rain, I go home — neither storm nor shine.",
          author: "Su Shi, 'Calming the Waves'",
        },
        {
          question: "Would you love the questions that have no answers yet?",
          quote:
            "Be patient toward all that is unsolved in your heart, and try to love the questions themselves.",
          author: "Rilke, Letters to a Young Poet",
        },
        {
          question: "Can the life you live withstand your own examination?",
          quote: "The unexamined life is not worth living.",
          author: "Socrates (Plato, Apology)",
        },
        {
          question: "Do you see others clearly — and yourself?",
          quote: "Knowing others is wisdom; knowing yourself is enlightenment.",
          author: "Laozi, Tao Te Ching, ch. 33",
        },
        {
          question: "What is the last bit of freedom you can hold onto now?",
          quote:
            "Freedom is secured not by the fulfilling of one's desires, but by the removal of desire.",
          author: "Epictetus, Enchiridion",
        },
        {
          question: "The river flows on, day and night — are you flowing too?",
          quote: "It passes on just like this, never ceasing day or night.",
          author: "Confucius, Analects, Book IX",
        },
        {
          question: "What will you do with all that's been laid upon you?",
          quote: "What's past is prologue.",
          author: "Shakespeare, The Tempest",
        },
        {
          question: "When the seas run high, dare you raise the sail?",
          quote:
            "A time will come to ride the wind and cleave the waves; I'll set my cloud-white sail and cross the sea.",
          author: "Li Bai, 'The Hard Road'",
        },
        {
          question:
            "You understand the road behind; what about the road ahead?",
          quote:
            "Life can only be understood backwards; but it must be lived forwards.",
          author: "Kierkegaard, Journals",
        },
        {
          question:
            "Soaked in mist and rain, can you still walk your road at ease?",
          quote:
            "A bamboo cane and straw sandals, lighter than a horse — who's afraid? In a straw cloak I'll live out my life through the misty rain.",
          author: "Su Shi, 'Calming the Waves'",
        },
        {
          question:
            "The bridge only you can cross — have you started walking it?",
          quote:
            "No one can build you the bridge on which you must cross the river of life, no one but you.",
          author: "Nietzsche, Schopenhauer as Educator",
        },
        {
          question: "Can you sit quietly, alone, in a room?",
          quote:
            "All of humanity's problems stem from our inability to sit quietly in a room alone.",
          author: "Blaise Pascal, Pensées",
        },
        {
          question: "When winds come from every side, do you still stand?",
          quote:
            "Battered by a thousand blows it stands firm, whatever wind blows from east, west, south or north.",
          author: "Zheng Banqiao, 'Bamboo in the Rock'",
        },
        {
          question:
            "How long must you be lost before you come to know yourself?",
          quote: "Not till we are lost do we begin to find ourselves.",
          author: "Henry David Thoreau, Walden",
        },
        {
          question: "The road is long — will you keep seeking?",
          quote:
            "Long, long is the road and far the journey; I will seek my truth high and low.",
          author: "Qu Yuan, 'Li Sao'",
        },
        {
          question: "Have you found the reason that makes life worth living?",
          quote:
            "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
          author: "Dostoevsky, The Brothers Karamazov",
        },
        {
          question:
            "Faced with an obstacle, do you ram it, or flow around like water?",
          quote:
            "The highest good is like water. Water benefits all things and does not contend.",
          author: "Laozi, Tao Te Ching, ch. 8",
        },
        {
          question: "When pressure comes, can you keep your composure?",
          quote:
            "Riding the great current of change, be neither glad nor afraid.",
          author: "Tao Yuanming, 'Body, Shadow, and Spirit'",
        },
        {
          question: "After hardship and exhaustion, what will you take up?",
          quote:
            "When Heaven is about to lay a great charge on someone, it first tries their resolve and works their body.",
          author: "Mencius, 'Gaozi II'",
        },
        {
          question: "Can you tell being defeated from being knocked down?",
          quote:
            "Not pleased by external gains, not saddened by personal losses.",
          author: "Fan Zhongyan, 'Yueyang Tower'",
        },
        {
          question: "Will you give everything to the present?",
          quote:
            "Seize the day, and put as little trust as you can in tomorrow.",
          author: "Horace, Odes",
        },
        {
          question:
            "That wound of yours — did it let the light in, or close a door?",
          quote:
            "Your pain is the breaking of the shell that encloses your understanding.",
          author: "Kahlil Gibran, The Prophet",
        },
        {
          question: "Might you truly begin only on the far side of despair?",
          quote:
            "We are all in the gutter, but some of us are looking at the stars.",
          author: "Oscar Wilde, Lady Windermere's Fan",
        },
        {
          question: "Rather than argue what good is, would you first be one?",
          quote:
            "Waste no more time arguing about what a good person should be. Be one.",
          author: "Marcus Aurelius, Meditations 10.16",
        },
        {
          question: "If there's no road beneath you, dare you make one?",
          quote: "Traveler, there is no road; the road is made by walking.",
          author: "Antonio Machado",
        },
        {
          question: "Will you make your life an adventure, or nothing at all?",
          quote: "Whoever strives with all his might, that one we can redeem.",
          author: "Goethe, Faust",
        },
        {
          question: "Would you go around it, or through it?",
          quote:
            "Keep carving and never stop, and even metal and stone can be engraved.",
          author: "Xunzi, 'Encouraging Learning'",
        },
        {
          question:
            "Pain is unavoidable — but will you carry the suffering too?",
          quote:
            "Take away the thought 'I have been harmed,' and the harm itself is gone.",
          author: "Marcus Aurelius, Meditations",
        },
        {
          question: "Do you know that dizziness of standing before a choice?",
          quote: "Anxiety is the dizziness of freedom.",
          author: "Kierkegaard, The Concept of Anxiety",
        },
        {
          question: "Some days just being alive is hard — is that brave too?",
          quote: "Sometimes even to live is an act of courage.",
          author: "Seneca, Letters to Lucilius",
        },
        {
          question: "Do you see loss as an ending, or as change?",
          quote: "Loss is nothing but change, and change is Nature's delight.",
          author: "Marcus Aurelius, Meditations 9.35",
        },
        {
          question: "Have you decided what you mean to become?",
          quote:
            "First say to yourself what you would be; and then do what you have to do.",
          author: "Epictetus",
        },
        {
          question:
            "This far along, will you still strive, seek, and not yield?",
          quote: "To strive, to seek, to find, and not to yield.",
          author: "Tennyson, 'Ulysses'",
        },
      ],
    },
    stillroom: {
      ariaLabel: "The Stillroom",
      label: "Stillroom · Breathe, and settle",
      lore: "Distil the weight of the deep into a flicker of light. Sit down, and just breathe with the fire.",
      phases: {
        inhale: { word: "In", cue: "Draw the deep slowly in" },
        hold: { word: "Hold", cue: "Stay here, just a beat" },
        exhale: { word: "Out", cue: "Let it out as light, slowly" },
        rest: { word: "Rest", cue: "An empty beat — nothing to do" },
      },
      keeper:
        "(The stillroom-keeper lays on another log; the fire glows softly, waiting while you catch your breath.)",
      safety:
        "If anything feels off, or you get lightheaded, just stop and breathe normally.",
      notice:
        "The stillroom is a place to ease your mind, not professional medical care. If your body feels unwell, judge by your own condition and seek professional medical help when you need it.",
      reset: "Back to the usual pace",
      settle: {
        hint: "Just breathe with the fire. It will ease you slower — when it feels right, stay at this pace.",
        stay: "Keep this pace",
      },
      paces: {
        open: "Try another pace",
        label: "Pick a breathing pace",
        names: {
          gentle: "Gentle",
          coherent: "Even",
          calm: "Calm",
          box: "Held",
          deep: "Deep",
        },
      },
    },
    library: {
      ariaLabel: "Library",
      barTitle: "Library · Look it up, fill back up",
      barSetOut: "Set out",
      indexLabel: "Contents",
      intro:
        "Look it up, fill back up. A modern reading list — drifting, havens, facing reality and impermanence.",
      shelves: [
        {
          heading: "Facing Reality · Resilience",
          entries: [
            {
              title: "Stanford 2005 Commencement Address",
              author: "Steve Jobs",
              blurb:
                "Connecting the dots, love and loss, living toward death; stay hungry, stay foolish.",
              url: "https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish",
            },
            {
              title: "The Fringe Benefits of Failure (Harvard 2008)",
              author: "J.K. Rowling",
              blurb:
                "Rock bottom became the solid foundation on which she rebuilt her life — and the power of imagination.",
              url: "https://www.jkrowling.com/harvard-commencement-address/",
            },
            {
              title: "Make Good Art (2012)",
              author: "Neil Gaiman",
              blurb:
                "When you're rejected, making mistakes, or lost — go and make good art.",
              url: "https://jamesclear.com/great-speeches/make-good-art-by-neil-gaiman",
            },
            {
              title: "The Power of Vulnerability (TED)",
              author: "Brené Brown",
              blurb:
                "Only by facing vulnerability do courage, connection and belonging grow.",
              url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
            },
            {
              title:
                "Why You Should Define Your Fears Instead of Your Goals (TED)",
              author: "Tim Ferriss",
              blurb: "Write down the worst case, and the fear shrinks.",
              url: "https://www.ted.com/talks/tim_ferriss_why_you_should_define_your_fears_instead_of_your_goals",
            },
            {
              title: "The Subtle Art of Not Giving a F*ck",
              author: "Mark Manson",
              blurb:
                "Strength isn't caring about everything; it's choosing what to care about.",
              url: "https://markmanson.net/not-giving-a-fuck",
            },
            {
              title: "The Obstacle Is the Way (overview)",
              author: "Ryan Holiday",
              blurb:
                "Turn obstacles into the way forward — Stoicism for today.",
              url: "https://ryanholiday.net/the-obstacle-is-the-way/",
            },
            {
              title: "Fixed vs. Growth Mindset",
              author: "Maria Popova (on Carol Dweck)",
              blurb: "Two ways of seeing failure decide how far you go.",
              url: "https://www.themarginalian.org/2014/01/29/carol-dweck-mindset/",
            },
            {
              title: "The Power of Introverts (TED)",
              author: "Susan Cain",
              blurb: "The quiet have power too; the value of solitude.",
              url: "https://www.ted.com/talks/susan_cain_the_power_of_introverts",
            },
            {
              title: "Man's Search for Meaning (overview)",
              author: "Viktor Frankl",
              blurb:
                "A psychology classic of finding meaning in the camps: with a 'why' you can bear almost any 'how'.",
              url: "https://en.wikipedia.org/wiki/Man%27s_Search_for_Meaning",
            },
            {
              title: "What I Learned from 100 Days of Rejection (TED)",
              author: "Jia Jiang",
              blurb: "Seeking out rejection on purpose tamed the fear of it.",
              url: "https://www.ted.com/talks/jia_jiang_what_i_learned_from_100_days_of_rejection",
            },
            {
              title:
                "How the Worst Moments in Our Lives Make Us Who We Are (TED)",
              author: "Andrew Solomon",
              blurb:
                "Forge meaning from suffering, rather than being defined by it.",
              url: "https://www.ted.com/talks/andrew_solomon_how_the_worst_moments_in_our_lives_make_us_who_we_are",
            },
            {
              title: "Success, Failure and the Drive to Keep Creating (TED)",
              author: "Elizabeth Gilbert",
              blurb:
                "At the peak or the bottom, return to the thing you love most.",
              url: "https://www.ted.com/talks/elizabeth_gilbert_success_failure_and_the_drive_to_keep_creating",
            },
            {
              title: "Why We All Need to Practice Emotional First Aid (TED)",
              author: "Guy Winch",
              blurb: "Tend psychological wounds the way you tend the body's.",
              url: "https://www.ted.com/talks/guy_winch_why_we_all_need_to_practice_emotional_first_aid",
            },
            {
              title: "Keep Your Identity Small",
              author: "Paul Graham",
              blurb:
                "Don't tie too much of yourself to labels, and you'll think more clearly.",
              url: "https://paulgraham.com/identity.html",
            },
            {
              title: "Mr. About-Right",
              author: "Hu Shi",
              blurb:
                "A satirical critique of 'good enough' complacency (modern vernacular essay).",
              url: "https://zh.wikisource.org/wiki/%E5%B7%AE%E4%B8%8D%E5%A4%9A%E5%85%88%E7%94%9F%E5%82%B3",
            },
          ],
        },
        {
          heading: "Time · Impermanence · Living Toward Death",
          entries: [
            {
              title: "The Tail End",
              author: "Tim Urban (Wait But Why)",
              blurb:
                "Charts out how much time you have left with the people you love.",
              url: "https://waitbutwhy.com/2015/12/the-tail-end.html",
            },
            {
              title: "Regrets of the Dying",
              author: "Bronnie Ware",
              blurb:
                "A palliative-care nurse's list of people's most common deathbed regrets.",
              url: "https://bronnieware.com/blog/regrets-of-the-dying/",
            },
            {
              title: "Life is Short",
              author: "Paul Graham",
              blurb:
                "Ruthlessly cut the unimportant; don't let 'busy' steal your life.",
              url: "https://paulgraham.com/vb.html",
            },
            {
              title: "The Eight Secrets to a Fairly Fulfilled Life",
              author: "Oliver Burkeman",
              blurb:
                "You'll never get everything done — and that realization sets you free.",
              url: "https://www.theguardian.com/lifeandstyle/2020/sep/04/oliver-burkemans-last-column-the-eight-secrets-to-a-fairly-fulfilled-life",
            },
            {
              title: "The Busy Trap",
              author: "Tim Kreider",
              blurb:
                "'I'm so busy' is often a hedge against emptiness and a self-reassurance.",
              url: "https://archive.nytimes.com/opinionator.blogs.nytimes.com/2012/06/30/the-busy-trap/",
            },
            {
              title: "Pale Blue Dot",
              author: "Carl Sagan",
              blurb:
                "Looking back at Earth as a mote of dust — on humility and cherishing it.",
              url: "https://www.planetary.org/worlds/pale-blue-dot",
            },
            {
              title: "How We Spend Our Days Is How We Spend Our Lives",
              author: "Annie Dillard (The Writing Life)",
              blurb: "Time hides in the small, ordinary choices.",
              url: "https://www.themarginalian.org/2013/06/07/annie-dillard-the-writing-life-1/",
            },
            {
              title: "Letting Go",
              author: "Atul Gawande (New Yorker)",
              blurb:
                "When medicine can't cure, how to walk the final stretch well.",
              url: "https://www.newyorker.com/magazine/2010/08/02/letting-go-2",
            },
            {
              title: "When Breath Becomes Air (overview)",
              author: "Paul Kalanithi",
              blurb:
                "A neurosurgeon, facing terminal illness, writes on what makes life worth living.",
              url: "https://en.wikipedia.org/wiki/When_Breath_Becomes_Air",
            },
            {
              title: "What Makes a Good Life? (TED)",
              author: "Robert Waldinger",
              blurb:
                "The longest study on happiness: good relationships keep us healthier and happier.",
              url: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness",
            },
            {
              title: "What Really Matters at the End of Life (TED)",
              author: "BJ Miller",
              blurb:
                "A hospice doctor on living well all the way to the last moment.",
              url: "https://www.ted.com/talks/bj_miller_what_really_matters_at_the_end_of_life",
            },
            {
              title: "What Makes Life Worth Living in the Face of Death (TED)",
              author: "Lucy Kalanithi",
              blurb: "Redefining 'worth it' amid loss and grave illness.",
              url: "https://www.ted.com/talks/lucy_kalanithi_what_makes_life_worth_living_in_the_face_of_death",
            },
            {
              title: "The 4 Stories We Tell Ourselves About Death (TED)",
              author: "Stephen Cave",
              blurb:
                "Unpacking the four narratives we use to soothe the fear of death.",
              url: "https://www.ted.com/talks/stephen_cave_the_4_stories_we_tell_ourselves_about_death",
            },
            {
              title: "My Philosophy for a Happy Life (TED)",
              author: "Sam Berns",
              blurb: "A teen with progeria on living large within limits.",
              url: "https://www.ted.com/talks/sam_berns_my_philosophy_for_a_happy_life",
            },
            {
              title: "Your Life in Weeks",
              author: "Tim Urban (Wait But Why)",
              blurb:
                "Drawing a whole life as a calendar of weeks — seeing time's limits.",
              url: "https://waitbutwhy.com/2014/05/life-weeks.html",
            },
            {
              title: "Rainy Alley",
              author: "Dai Wangshu",
              blurb:
                "A long, wistful modern poem — walking the loneliness under an umbrella.",
              url: "https://zh.wikisource.org/wiki/%E9%9B%A8%E5%B7%B7",
            },
          ],
        },
        {
          heading: "Stillness · Focus · Solitude",
          entries: [
            {
              title: "The Joy of Quiet",
              author: "Pico Iyer (New York Times)",
              blurb:
                "In the flood of information, the luxury of deliberate emptiness and stillness.",
              url: "https://www.highbrowmagazine.com/joy-quiet",
            },
            {
              title: "The Art of Stillness (TED)",
              author: "Pico Iyer",
              blurb: "Going nowhere, and arriving.",
              url: "https://www.ted.com/talks/pico_iyer_the_art_of_stillness",
            },
            {
              title: "The Peace of Wild Things (poem)",
              author: "Wendell Berry",
              blurb:
                "When you fear for the world at night, go to the still water and rest in grace, and be free.",
              url: "https://onbeing.org/poetry/the-peace-of-wild-things/",
            },
            {
              title: "I Used to Be a Human Being",
              author: "Andrew Sullivan",
              blurb:
                "Attention devoured by tech, and a silence to win yourself back.",
              url: "https://longreads.com/2016/09/22/i-used-to-be-a-human-being/",
            },
            {
              title: "Breathe",
              author: "Leo Babauta (Zen Habits)",
              blurb: "When everything's too much, return to a single breath.",
              url: "https://zenhabits.net/breathe/",
            },
            {
              title: "In Praise of Idleness (1932)",
              author: "Bertrand Russell",
              blurb: "Rethinking work and leisure: empty time isn't waste.",
              url: "https://www.panarchy.org/russell/idleness.1932.html",
            },
            {
              title: "Deep Work · Digital Minimalism (essays)",
              author: "Cal Newport",
              blurb:
                "In a distracted age, guarding the rare, precious skill of focus.",
              url: "https://calnewport.com/writing/",
            },
            {
              title: "All It Takes Is 10 Mindful Minutes (TED)",
              author: "Andy Puddicombe",
              blurb: "Doing nothing, and being fully aware of this moment.",
              url: "https://www.ted.com/talks/andy_puddicombe_all_it_takes_is_10_mindful_minutes",
            },
            {
              title: "The Habits of Happiness (TED)",
              author: "Matthieu Ricard",
              blurb: "Happiness is a skill you can train, not luck.",
              url: "https://www.ted.com/talks/matthieu_ricard_the_habits_of_happiness",
            },
            {
              title: "A Simple Way to Break a Bad Habit (TED)",
              author: "Judson Brewer",
              blurb:
                "Use curious awareness to loosen the loop of anxiety and impulse.",
              url: "https://www.ted.com/talks/judson_brewer_a_simple_way_to_break_a_bad_habit",
            },
            {
              title: "Want to Be Happy? Be Grateful (TED)",
              author: "David Steindl-Rast",
              blurb: "Stop, look, go — treat each moment as a gift.",
              url: "https://www.ted.com/talks/david_steindl_rast_want_to_be_happy_be_grateful",
            },
            {
              title: "Flow, the Secret to Happiness (TED)",
              author: "Mihaly Csikszentmihalyi",
              blurb:
                "The self-forgetting joy of full absorption, losing track of time.",
              url: "https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness",
            },
            {
              title: "The Paradox of Choice (TED)",
              author: "Barry Schwartz",
              blurb: "Too many options make us anxious, not happy.",
              url: "https://www.ted.com/talks/barry_schwartz_the_paradox_of_choice",
            },
            {
              title: "The Top Idea in Your Mind",
              author: "Paul Graham",
              blurb: "Don't let anxiety occupy the thought you dwell on most.",
              url: "https://paulgraham.com/top.html",
            },
            {
              title: "How to Be Present",
              author: "Leo Babauta (Zen Habits)",
              blurb:
                "Gently bring your attention back to now, again and again.",
              url: "https://zenhabits.net/presence/",
            },
            {
              title: "In Praise of Slowness (TED)",
              author: "Carl Honoré",
              blurb: "Against the age's anxiety of faster-and-faster.",
              url: "https://www.ted.com/talks/carl_honore_in_praise_of_slowness",
            },
          ],
        },
        {
          heading: "Meaning · Work · Calling",
          entries: [
            {
              title: "How to Do What You Love",
              author: "Paul Graham",
              blurb:
                "Don't work for fame or money; what is it you truly want to do?",
              url: "https://paulgraham.com/love.html",
            },
            {
              title: "Maker's Schedule, Manager's Schedule",
              author: "Paul Graham",
              blurb:
                "Two kinds of schedule — guard the long stretches that making needs.",
              url: "https://paulgraham.com/makersschedule.html",
            },
            {
              title: "Hell Yeah or No",
              author: "Derek Sivers",
              blurb: "It's either 'Hell yeah!' or it's a no.",
              url: "https://sive.rs/hellyeah",
            },
            {
              title: "Why I Write",
              author: "George Orwell",
              blurb:
                "The four motives for writing, and an honesty with yourself.",
              url: "https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/why-i-write/",
            },
            {
              title: "On Self-Respect",
              author: "Joan Didion",
              blurb: "Self-respect is a peace made with yourself.",
              url: "https://www.vogue.com/article/joan-didion-self-respect-essay-1961",
            },
            {
              title: "12 Truths I Learned from Life and Writing (TED)",
              author: "Anne Lamott",
              blurb: "Twelve reminders on honesty, mercy and impermanence.",
              url: "https://www.ted.com/talks/anne_lamott_12_truths_i_learned_from_life_and_writing",
            },
            {
              title: "Continuous Improvement",
              author: "James Clear",
              blurb: "1% better each day compounds into a vast difference.",
              url: "https://jamesclear.com/continuous-improvement",
            },
            {
              title: "Steal Like an Artist",
              author: "Austin Kleon",
              blurb:
                "Creation is standing on what you love and recombining it.",
              url: "https://austinkleon.com/steal/",
            },
            {
              title: "68 Bits of Unsolicited Advice",
              author: "Kevin Kelly",
              blurb: "Life advice distilled from living past sixty.",
              url: "https://kk.org/thetechnium/68-bits-of-unsolicited-advice/",
            },
            {
              title: "The Psychology of Money",
              author: "Morgan Housel",
              blurb: "The ties between wealth, greed, enough, and happiness.",
              url: "https://collabfund.com/blog/the-psychology-of-money/",
            },
            {
              title: "There's More to Life Than Being Happy (TED)",
              author: "Emily Esfahani Smith",
              blurb:
                "The four pillars of meaning: belonging, purpose, transcendence, storytelling.",
              url: "https://www.ted.com/talks/emily_esfahani_smith_there_s_more_to_life_than_being_happy",
            },
            {
              title: "The Happy Secret to Better Work (TED)",
              author: "Shawn Achor",
              blurb:
                "Happiness first, then good performance — not the other way round.",
              url: "https://www.ted.com/talks/shawn_achor_the_happy_secret_to_better_work",
            },
            {
              title: "Are You a Giver or a Taker? (TED)",
              author: "Adam Grant",
              blurb:
                "How generosity brings meaning and achievement over the long run.",
              url: "https://www.ted.com/talks/adam_grant_are_you_a_giver_or_a_taker",
            },
            {
              title: "The Acceleration of Addictiveness",
              author: "Paul Graham",
              blurb:
                "When everything is engineered to addict, how to keep your footing.",
              url: "https://paulgraham.com/addiction.html",
            },
            {
              title: "The Goldilocks Rule",
              author: "James Clear",
              blurb:
                "The secret to motivation: challenges not too hard, not too easy.",
              url: "https://jamesclear.com/goldilocks-rule",
            },
            {
              title: "Getting Rich vs. Staying Rich",
              author: "Morgan Housel",
              blurb: "Earning and keeping are two entirely different skills.",
              url: "https://collabfund.com/blog/getting-rich-vs-staying-rich/",
            },
          ],
        },
        {
          heading: "More Modern Voices · Modern Chinese",
          entries: [
            {
              title: "This Is Water (2005)",
              author: "David Foster Wallace",
              blurb:
                "Learn to choose what to attend to, and live the daily dullness as awareness and kindness.",
              url: "https://fs.blog/david-foster-wallace-this-is-water/",
            },
            {
              title: "7 Lessons from 7 Years of Writing",
              author: "Maria Popova (The Marginalian)",
              blurb: "Life lessons on doubt, generosity and patience.",
              url: "https://www.themarginalian.org/2013/10/23/7-lessons-from-7-years/",
            },
            {
              title: "Religion for the Nonreligious",
              author: "Tim Urban (Wait But Why)",
              blurb:
                "Growing, step by step, into a clearer self — without religion.",
              url: "https://waitbutwhy.com/2014/10/religion-for-the-nonreligious.html",
            },
            {
              title: "Your Elusive Creative Genius (TED)",
              author: "Elizabeth Gilbert",
              blurb:
                "Treat genius as a visiting guest, and lay down the burden of creating.",
              url: "https://www.ted.com/talks/elizabeth_gilbert_your_elusive_creative_genius",
            },
            {
              title: "The Gift and Power of Emotional Courage (TED)",
              author: "Susan David",
              blurb:
                "Resilience begins where we stop avoiding painful emotions.",
              url: "https://www.ted.com/talks/susan_david_the_gift_and_power_of_emotional_courage",
            },
            {
              title: "How to Make Stress Your Friend (TED)",
              author: "Kelly McGonigal",
              blurb:
                "Change how you see stress, and you change its effect on you.",
              url: "https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
            },
            {
              title: "Grit (TED)",
              author: "Angela Duckworth",
              blurb:
                "More than talent: passion and perseverance for long-term goals.",
              url: "https://www.ted.com/talks/angela_lee_duckworth_grit_the_power_of_passion_and_perseverance",
            },
            {
              title: "Haste",
              author: "Zhu Ziqing",
              blurb:
                "A modern essay on time slipping through the fingers — echoing the tide and impermanence.",
              url: "https://zh.wikisource.org/wiki/%E5%8C%86%E5%8C%86",
            },
            {
              title: "Hometown",
              author: "Lu Xun",
              blurb:
                "The home you can't return to, and 'there was no road, but as many walk it, a road is made'.",
              url: "https://zh.wikisource.org/wiki/%E6%95%85%E9%84%89",
            },
            {
              title: "Saying Goodbye to Cambridge Again",
              author: "Xu Zhimo",
              blurb: "A gentle farewell, sorrow soft as water.",
              url: "https://zh.wikisource.org/wiki/%E5%86%8D%E5%88%A5%E5%BA%B7%E6%A9%8B",
            },
            {
              title: "The Surprising Science of Happiness (TED)",
              author: "Dan Gilbert",
              blurb:
                "We 'synthesize' happiness — well-being isn't only about circumstance.",
              url: "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness",
            },
            {
              title: "Listening to Shame (TED)",
              author: "Brené Brown",
              blurb: "How shame works, and how not to be crushed by it.",
              url: "https://www.ted.com/talks/brene_brown_listening_to_shame",
            },
            {
              title: "Inside the Mind of a Master Procrastinator (TED)",
              author: "Tim Urban",
              blurb:
                "Unpacking procrastination with humor — and the panic with no deadline.",
              url: "https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator",
            },
            {
              title: "How to Beat Procrastination",
              author: "Tim Urban (Wait But Why)",
              blurb: "Making 'do it now' possible, step by step.",
              url: "https://waitbutwhy.com/2013/11/how-to-beat-procrastination.html",
            },
            {
              title: "There's No Speed Limit",
              author: "Derek Sivers",
              blurb: "No one says you can only move at 'normal speed'.",
              url: "https://sive.rs/kimo",
            },
            {
              title: "The Sight of a Father's Back",
              author: "Zhu Ziqing",
              blurb:
                "A father's back on the platform — restrained, deep family love (modern essay).",
              url: "https://zh.wikisource.org/wiki/%E8%83%8C%E5%BD%B1",
            },
          ],
        },
      ],
    },
  },
};

export default bundle;
