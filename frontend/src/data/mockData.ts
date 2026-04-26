export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  user: string;
  date: string;
  rotationClass?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Permanence of Graphite",
    excerpt: "There is a distinct finality to ink that graphite lacks. To write with lead is to negotiate with the future, to leave a mark that acknowledges its own transience. Yet, as the smudge of a palm across a page suggests...",
    user: "@h_thoreau",
    date: "XXIV. OCT. MMXXIV",
  },
  {
    id: "2",
    title: "Postage and Patience",
    excerpt: "Waiting for a letter is a form of discipline. In an era of instant delivery, the silence of the mailbox becomes a canvas for anticipation. We explore the emotional weight of physical distance and the paper trail...",
    user: "@letter_lost",
    date: "XII. NOV. MMXXIV",
    rotationClass: "rotate-1",
  },
  {
    id: "3",
    title: "Indigo & Identity",
    excerpt: "Blue ink is not just a choice of pigment; it is an orientation of the soul. From the deep navy of bureaucratic documents to the bright turquoise of a traveler's journal, the shade of blue we choose...",
    user: "@ink_stain",
    date: "I. DEC. MMXXIV",
    rotationClass: "-rotate-1",
  },
  {
    id: "4",
    title: "The Tactile Web",
    excerpt: "Can a digital screen ever replicate the resistance of a nib against a toothy paper? We look at the emerging technologies that attempt to bring the friction of reality back into the frictionless void of software...",
    user: "@slow_web",
    date: "XV. DEC. MMXXIV",
  },
  {
    id: "5",
    title: "Marginalia & Memory",
    excerpt: "The true history of literature is written in the margins. The \"X\" marks, the coffee rings, and the \"Yes!\" scribbled in a fit of agreement tell the story of a reader meeting a writer halfway...",
    user: "@archivist",
    date: "XIX. DEC. MMXXIV",
    rotationClass: "rotate-2",
  },
  {
    id: "6",
    title: "Wax Seals & Secrets",
    excerpt: "Security in the analog age was a matter of heat and wax. To break a seal is to commit a trespass, a visceral act that no digital encryption can truly simulate. We dive into the ritual of the sigil...",
    user: "@sigil_key",
    date: "XXV. DEC. MMXXIV",
    rotationClass: "-rotate-2",
  }
];
