
export interface Level {
  id: number;
  name: string;
  par: number;
  startPosition: [number, number, number];
  holePosition: [number, number, number];
  holeRadius: number;
  obstacles: {
    type: 'box' | 'ramp';
    position: [number, number, number];
    size: [number, number, number];
    rotation?: [number, number, number];
  }[];
  sandpits?: {
    position: [number, number, number];
    radius: number;
  }[];
  trees?: {
    position: [number, number, number];
  }[];
  terrain?: {
    type: 'slope' | 'curve';
  }
}

export const levels: Level[] = [
  // Easy Levels
  {
    id: 1,
    name: 'The First Tee',
    par: 1,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      // Borders
      { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
      { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
      { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
      { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
    ],
    sandpits: [
      { position: [3, 0.02, 0], radius: 1.5 },
    ],
    trees: [
      { position: [-5, 0, 2] },
    ]
  },
  {
    id: 2,
    name: "The Bridge",
    par: 2,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
        // Borders
        { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
        { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
        { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
        { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
        { type: 'ramp', position: [0, 0.2, 3], size: [4, 0.5, 8], rotation: [0.25, 0, 0] },
        { type: 'ramp', position: [0, 0.2, -5], size: [4, 0.5, 8], rotation: [-0.25, 0, 0] },
        // Railings for the bridge
        { type: 'box', position: [2.25, 0.8, 3], size: [0.5, 0.5, 8], rotation: [0.25, 0, 0] },
        { type: 'box', position: [-2.25, 0.8, 3], size: [0.5, 0.5, 8], rotation: [0.25, 0, 0] },
        { type: 'box', position: [2.25, 0.8, -5], size: [0.5, 0.5, 8], rotation: [-0.25, 0, 0] },
        { type: 'box', position: [-2.25, 0.8, -5], size: [0.5, 0.5, 8], rotation: [-0.25, 0, 0] },
        // Backstop behind the hole
        { type: 'box', position: [0, 0.25, -11.5], size: [4, 0.5, 0.5] },
    ],
    sandpits: [
        { position: [4, 0.02, 0], radius: 2 },
        { position: [-4, 0.02, 0], radius: 2 }
    ],
    trees: [
      { position: [-6, 0, 5] },
      { position: [6, 0, -5] },
    ]
  },
  {
    id: 3,
    name: "The Bottleneck",
    par: 2,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
      // Borders
      { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
      { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
      { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
      { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
      // The bottleneck walls
      { type: 'box', position: [1.5, 0.5, 0], size: [1, 1, 6] },
      { type: 'box', position: [-1.5, 0.5, 0], size: [1, 1, 6] },
      // Blocks around the hole
      { type: 'box', position: [0, 0.25, -11.2], size: [0.5, 0.5, 0.5] },
      { type: 'box', position: [0, 0.25, -8.8], size: [0.5, 0.5, 0.5] },
      { type: 'box', position: [1.2, 0.25, -10], size: [0.5, 0.5, 0.5] },
      { type: 'box', position: [-1.2, 0.25, -10], size: [0.5, 0.5, 0.5] }
    ],
    sandpits: [
        { position: [4, 0.02, 6], radius: 2 },
        { position: [-4, 0.02, -6], radius: 2 },
    ],
    trees: [
        { position: [6, 0, 2] },
        { position: [-6, 0, -2] },
    ]
  },
   {
    id: 4,
    name: "Precision",
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.2,
    obstacles: [
        // Borders
        { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
        { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
        { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
        { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
        { type: 'box', position: [0, 0.5, 5], size: [8, 1, 0.5] },
        { type: 'box', position: [-3, 0.5, -5], size: [2, 1, 0.5] },
        { type: 'box', position: [3, 0.5, -5], size: [2, 1, 0.5] },
        // Blocks around the hole
        { type: 'box', position: [0, 0.25, -13.5], size: [0.5, 0.5, 0.5] },
        { type: 'box', position: [0, 0.25, -10.5], size: [0.5, 0.5, 0.5] },
        { type: 'box', position: [1.5, 0.25, -12], size: [0.5, 0.5, 0.5] },
        { type: 'box', position: [-1.5, 0.25, -12], size: [0.5, 0.5, 0.5] }
    ],
    sandpits: [
        { position: [4, 0.02, 8], radius: 1.5 },
        { position: [0, 0.02, -8], radius: 2 },
    ],
    trees: [
        { position: [6, 0, 0] },
        { position: [-6, 0, 0] },
    ]
  },
  {
    id: 5,
    name: "The Slingshot",
    par: 4,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -6],
    holeRadius: 0.25,
    obstacles: [
      // Borders
      { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
      { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
      { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
      { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
      // U-shaped structure
      { type: 'box', position: [6, 0.5, 0], size: [1, 1, 16] },
      { type: 'box', position: [-6, 0.5, 0], size: [1, 1, 16] },
      { type: 'box', position: [0, 0.5, -8], size: [12, 1, 1] },
      
      // Staggered horizontal barriers
      { type: 'box', position: [1.5, 0.5, 4], size: [9, 1, 0.5] }, // From right wall
      { type: 'box', position: [-1.5, 0.5, -2], size: [9, 1, 0.5] }, // From left wall
    ],
    sandpits: [
      { position: [0, 0.02, 10], radius: 2 },
      { position: [0, 0.02, 1], radius: 1.5 },
      { position: [-4.5, 0.02, 3], radius: 1 },
      { position: [0, 0.02, -1], radius: 1.5 },
      { position: [4.5, 0.02, -5], radius: 1 },
    ],
    trees: [
      { position: [8, 0, 8] },
      { position: [-8, 0, 8] },
      { position: [8, 0, -10] },
      { position: [-8, 0, -10] },
    ]
  },
  {
    id: 6,
    name: "The Labyrinth",
    par: 5,
    startPosition: [0, 0.2, 20],
    holePosition: [10, 0.01, -10],
    holeRadius: 0.3,
    obstacles: [
      // Outer walls
      { type: 'box', position: [0, 0.5, 25.5], size: [52, 1, 1] },
      { type: 'box', position: [0, 0.5, -25.5], size: [52, 1, 1] },
      { type: 'box', position: [25.5, 0.5, 0], size: [1, 1, 52] },
      { type: 'box', position: [-25.5, 0.5, 0], size: [1, 1, 52] },
      
      // Maze layout
      { type: 'box', position: [-6, 0.5, 18], size: [38, 1, 1] },
      { type: 'box', position: [6, 0.5, 10], size: [38, 1, 1] },
      { type: 'box', position: [-6, 0.5, 2], size: [38, 1, 1] },
      { type: 'box', position: [6, 0.5, -6], size: [38, 1, 1] },
      { type: 'box', position: [-6, 0.5, -14], size: [38, 1, 1] },
    ],
    sandpits: [],
    trees: [
      { position: [-10.5, 0, -10.5] },
      { position: [10.5, 0, 10.5] },
    ]
  }
];
