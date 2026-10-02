export type Movement = {
  id: number;
  name: string;
  slug: string;
  dateBegin: number;
  dateEnd: number | string;
  thumbnail: string;
  width: number;
  height: number;
  description: string;
  historicalContext: string;
  keyInfluences: string[];
  colorLineLight: string;
  colorLineDark: string;
};

export const welcomeImages = [
  { src: "/images/victorian-1.webp", width: 461, height: 720 },
  { src: "/images/image2.png", width: 293, height: 198 },
  { src: "/images/late-modern-1.webp", width: 750, height: 1061 },
  { src: "/images/flat-1.webp", width: 500, height: 750 },
  { src: "/images/image5.png", width: 354, height: 195 },
];

export const movements: Movement[] = [
  {
    id: 1,
    name: "Victorian",
    slug: "victorian",
    dateBegin: 1837,
    dateEnd: 1901,
    thumbnail: "/images/victorian-1.webp",
    width: 461,
    height: 720,
    description:
      "Victorian design features ornate, intricate styles with elaborate imagery and decorative borders. It emphasizes symmetry and historical revival, reflecting the era's opulence.",
    historicalContext:
      "Coinciding with Queen Victoria's reign, this era saw rapid industrialization. Design blended Gothic, Renaissance, and Baroque elements, influenced by historical artifacts.",
    keyInfluences: [
      "William Morris: Leader in Arts and Crafts Movement, advocating traditional craftsmanship.",
      "Charles Rennie Mackintosh: Known for blending Victorian and modernist design elements.",
    ],
    colorLineLight: "#d8c287",
    colorLineDark: "#edc250",
  },
  {
    id: 2,
    name: "Art & Crafts",
    slug: "art-craft",
    dateBegin: 1880,
    dateEnd: 1920,
    thumbnail: "/images/art-craft-1.webp",
    width: 1506,
    height: 1790,
    description:
      "Arts and Crafts emphasizes handcrafted quality and traditional craftsmanship, reacting against Victorian mass production. It promotes artistic integrity and natural materials.",
    historicalContext:
      "Emerged as a response to industrialization, restoring value to handmade goods. Significantly impacted architecture, interior design, and decorative arts.",
    keyInfluences: [
      "William Morris: Promoted handcrafted designs and traditional methods.",
      "Charles Voysey: Integrated Arts and Crafts principles into architecture and design.",
    ],
    colorLineLight: "#bf8c6f",
    colorLineDark: "#cb7849",
  },
  {
    id: 3,
    name: "Art Nouveau",
    slug: "art-nouveau",
    dateBegin: 1880,
    dateEnd: 1910,
    thumbnail: "/images/art-nouveau-1.webp",
    width: 813,
    height: 1200,
    description:
      "Art Nouveau features flowing, organic lines and floral motifs. It departs from historical styles, embracing modernity and nature-inspired design in objects and architecture.",
    historicalContext:
      "Emerged late 19th century, integrating beauty into functional objects. Reflected desire to break from historical revival styles.",
    keyInfluences: [
      "Alphonse Mucha: Known for decorative posters in distinctive Art Nouveau style.",
      "Gustav Klimt: Austrian painter reflecting ornate, sensual Art Nouveau qualities.",
    ],
    colorLineLight: "#fbdea8",
    colorLineDark: "#f0c811",
  },
  {
    id: 4,
    name: "Art Deco",
    slug: "art-deco",
    dateBegin: 1919,
    dateEnd: 1940,
    thumbnail: "/images/art-deco-1.webp",
    width: 571,
    height: 799,
    description:
      "Art Deco features sleek, geometric forms and luxurious materials, reflecting 1920s modernity and optimism. It combines elements of modernism with opulent design.",
    historicalContext:
      "Originated in the 1920s, representing Roaring Twenties exuberance. Embraced streamlined aesthetics and industrial elements.",
    keyInfluences: [
      "A.M. Cassandre: Created influential Art Deco posters and typographic designs.",
      "Eileen Gray: Known for innovative furniture incorporating Art Deco principles.",
    ],
    colorLineLight: "#bc4644",
    colorLineDark: "#e2403d",
  },
  {
    id: 5,
    name: "Constructivist",
    slug: "constructivist",
    dateBegin: 1913,
    dateEnd: 1940,
    thumbnail: "/images/constructivist-1.webp",
    width: 1770,
    height: 2528,
    description:
      "Constructivism emphasizes geometric abstraction and utilitarian design for political propaganda. It aligns art with industrial production and socialist ideals.",
    historicalContext:
      "Developed in post-revolutionary Russia, integrating art with industrial and socialist principles. Promoted new visual language aligned with Soviet values.",
    keyInfluences: [
      "El Lissitzky: Known for geometric abstraction and innovative graphic design.",
      "Alexander Rodchenko: Created experimental posters and photography in Constructivist style.",
    ],
    colorLineLight: "#d43a30",
    colorLineDark: "#d8362c",
  },
  {
    id: 6,
    name: "Heroic Realism",
    slug: "heroic-realism",
    dateBegin: 1900,
    dateEnd: 1940,
    thumbnail: "/images/heroic-realism-1.webp",
    width: 714,
    height: 1000,
    description:
      "Heroic Realism depicts idealized figures and themes in political propaganda. It emphasizes grandeur and glorification of state achievements.",
    historicalContext:
      "Developed in Soviet Russia to promote state ideals and national pride. Depicted achievements of the socialist state and its leaders.",
    keyInfluences: [
      "Isaak Brodsky: Created heroic portraits of Soviet leaders and workers.",
      "Vladimir Mayakovsky: Poet whose public art embodied Heroic Realism.",
    ],
    colorLineLight: "#d2333c",
    colorLineDark: "#d2333c",
  },
  {
    id: 7,
    name: "Pop Art",
    slug: "pop-art",
    dateBegin: 1950,
    dateEnd: 1960,
    thumbnail: "/images/pop-art-1.webp",
    width: 1404,
    height: 2000,
    description:
      "Pop Art uses imagery from popular culture and mass media. It features bold colors and commercial techniques, challenging traditional art forms.",
    historicalContext:
      "Emerged in 1950s, reflecting post-war consumer boom and rise of mass media. Celebrated everyday objects and popular culture in art.",
    keyInfluences: [
      "Andy Warhol: Created iconic works featuring celebrities and consumer products.",
      "Roy Lichtenstein: Known for comic strip-inspired art and Ben-Day dots.",
    ],
    colorLineLight: "#be272d",
    colorLineDark: "#be272d",
  },
  {
    id: 8,
    name: "Swiss School",
    slug: "swiss-school",
    dateBegin: 1940,
    dateEnd: 1980,
    thumbnail: "/images/swiss-school-1.webp",
    width: 1660,
    height: 2336,
    description:
      "Swiss School, or International Typographic Style, features grid-based design and clean typography. It emphasizes clarity and functionality in visual communication.",
    historicalContext:
      "Originated in Switzerland, became global standard for graphic design. Focused on objectivity and precision in visual communication.",
    keyInfluences: [
      "Josef Müller-Brockmann: Known for grid-based design and typographic clarity.",
      "Armin Hofmann: Promoted Swiss School principles through influential design work.",
    ],
    colorLineLight: "#f01e0f",
    colorLineDark: "#e31b0d",
  },
  {
    id: 9,
    name: "Psychedelic",
    slug: "psychedelic",
    dateBegin: 1960,
    dateEnd: 1970,
    thumbnail: "/images/psychedelic-1.webp",
    width: 1000,
    height: 1628,
    description:
      "Psychedelic design uses vibrant colors, swirling patterns, and distorted typography. It reflects 1960s counterculture and altered states of consciousness.",
    historicalContext:
      "Associated with 1960s counterculture, captured era's experimental spirit through bold, surreal visual elements.",
    keyInfluences: [
      "Wes Wilson: Created iconic psychedelic concert posters with bold colors and intricate designs.",
      "Victor Moscoso: Known for colorful, surreal posters and use of visual distortion.",
    ],
    colorLineLight: "#64ede4",
    colorLineDark: "#4ac1b9",
  },
  {
    id: 10,
    name: "Post Modern",
    slug: "post-modern",
    dateBegin: 1970,
    dateEnd: 1980,
    thumbnail: "/images/post-modern-1.webp",
    width: 800,
    height: 1066,
    description:
      "Postmodern design features an eclectic mix of styles and playful irony. It departs from modernist formalism, embracing diverse influences and experimental approaches.",
    historicalContext:
      "Reacted against modernism's strict rules, introducing playful, diverse approach. Incorporated historical references and unconventional aesthetics.",
    keyInfluences: [
      "Paula Scher: Known for vibrant, typographic work and eclectic design elements.",
      "April Greiman: Integrated digital technology with Postmodern aesthetics.",
    ],
    colorLineLight: "#faee05",
    colorLineDark: "#ead009",
  },
  {
    id: 11,
    name: "Grunge",
    slug: "grunge",
    dateBegin: 1990,
    dateEnd: 2000,
    thumbnail: "/images/grunge-1.webp",
    width: 595,
    height: 708,
    description:
      "Grunge design features raw, distressed aesthetics with torn edges and layered textures. It reflects cultural backlash against polished mainstream design.",
    historicalContext:
      "Emerged in 1990s as reaction to clean styles of earlier decades. Embraced rebellious, DIY aesthetic.",
    keyInfluences: [
      "David Carson: Pioneered innovative typography and distressed visuals in Grunge.",
      "Barbara Kruger: Used bold text and layered imagery, influencing grunge visuals.",
    ],
    colorLineLight: "#c98c71",
    colorLineDark: "#9a3d14",
  },
  {
    id: 12,
    name: "Flat Design",
    slug: "flat",
    dateBegin: 2010,
    dateEnd: "TODAY",
    thumbnail: "/images/flat-1.webp",
    width: 500,
    height: 750,
    description:
      "Flat Design emphasizes minimalism and simplicity. It uses clean, flat colors without 3D effects, avoiding complex textures and gradients.",
    historicalContext:
      "Emerged early 2010s, reacting against skeuomorphic trends. Aligned with modern web/app design prioritizing functionality and user experience.",
    keyInfluences: [
      "Jonny Ive: Influential Apple designer emphasizing simplicity and flat aesthetics.",
      "Microsoft's Metro UI: Pioneered flat design principles in user interfaces.",
    ],
    colorLineLight: "#ea1c00",
    colorLineDark: "#ea1c00",
  },
];
