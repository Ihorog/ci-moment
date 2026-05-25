export const LEGEND_ATLAS = {
  elements: [
    {
      code: 'GROUND',
      label: 'Ground State',
      text: 'GROUND STATE: System stabilized. The decision has a solid base and can be treated as a grounded event.'
    },
    {
      code: 'FLOW',
      label: 'Aqueous Flow',
      text: 'AQUEOUS FLOW: Adaptive conditions are active. The event should move through friction instead of fighting it.'
    },
    {
      code: 'THERMAL',
      label: 'Thermal Energy',
      text: 'THERMAL ENERGY: High-intensity pressure is present. The moment asks for transformation, not delay.'
    },
    {
      code: 'AERIAL',
      label: 'Aerial Vector',
      text: 'AERIAL VECTOR: Mental clearance is available. The decision removes a previous restriction and opens movement.'
    }
  ],
  celestial: [
    { code: 'SOLAR', label: 'Solar Axis', text: 'SOLAR AXIS: The center of gravity shifts toward direct authorship and visible action.' },
    { code: 'LUNAR', label: 'Lunar Cycle', text: 'LUNAR CYCLE: Hidden context becomes readable through reflection and timing.' },
    { code: 'MERCURY', label: 'Mercury Shift', text: 'MERCURY SHIFT: Communication channels are open. The event favors a clear message.' },
    { code: 'VENUS', label: 'Venus Alignment', text: 'VENUS ALIGNMENT: The field favors aesthetic peace, attraction, and shared ease.' },
    { code: 'MARS', label: 'Mars Momentum', text: 'MARS MOMENTUM: The system records force, urgency, and readiness for decisive motion.' },
    { code: 'JUPITER', label: 'Jupiter Expansion', text: 'JUPITER EXPANSION: A small permission can scale into a larger opening.' },
    { code: 'SATURN', label: 'Saturn Ring', text: 'SATURN RING: Disorder becomes structured. The event receives boundary and form.' },
    { code: 'URANUS', label: 'Uranus Spark', text: 'URANUS SPARK: Sudden clarity breaks a legacy pattern and releases a new path.' },
    { code: 'NEPTUNE', label: 'Neptune Depth', text: 'NEPTUNE DEPTH: The event carries meaning beneath the visible surface.' }
  ],
  logic: [
    { code: 'FEHU', label: 'Resource Claim', text: 'CODE FEHU: Resource acquisition. Time and attention are reclaimed as usable value.' },
    { code: 'URUZ', label: 'Will Force', text: 'CODE URUZ: Strength of intent. The pass confirms active will.' },
    { code: 'THURISAZ', label: 'Protected Threshold', text: 'CODE THURISAZ: A boundary is established. External interference is reduced.' },
    { code: 'ANSUZ', label: 'Signal Received', text: 'CODE ANSUZ: A signal has been received and converted into a readable mark.' },
    { code: 'RAIDHO', label: 'Route Motion', text: 'CODE RAIDHO: The route is active. The event is already in motion.' },
    { code: 'KENAZ', label: 'Illumination', text: 'CODE KENAZ: The system highlights the essential path without ornamental noise.' },
    { code: 'GEBO', label: 'Exchange Balance', text: 'CODE GEBO: The decision creates a balanced exchange between two sides.' },
    { code: 'WUNJO', label: 'Joy Peak', text: 'CODE WUNJO: The event favors relief, completion, and shared enjoyment.' },
    { code: 'HAGALAZ', label: 'Obstacle Break', text: 'CODE HAGALAZ: Old interference is broken apart so the event can pass.' },
    { code: 'NAUDHIZ', label: 'Need Resolved', text: 'CODE NAUDHIZ: Resistance becomes fuel. Constraint turns into clarity.' },
    { code: 'ISA', label: 'Static Seal', text: 'CODE ISA: The moment is frozen long enough to become an artifact.' },
    { code: 'JERA', label: 'Harvest Cycle', text: 'CODE JERA: Previous effort returns as usable result.' },
    { code: 'EIHWAZ', label: 'Transition Spine', text: 'CODE EIHWAZ: The event moves through a protected transformation channel.' },
    { code: 'PERTHRO', label: 'Secret Opened', text: 'CODE PERTHRO: The sealed unknown becomes a personal document.' },
    { code: 'ELHAZ', label: 'Higher Guard', text: 'CODE ELHAZ: The pass protects the decision field from dilution.' },
    { code: 'SOWILO', label: 'Clear Charge', text: 'CODE SOWILO: Direct energy enters the event and clarifies its outcome.' },
    { code: 'TIWAZ', label: 'Leader Vector', text: 'CODE TIWAZ: Responsibility is accepted and converted into action.' },
    { code: 'BERKANO', label: 'Renewal Form', text: 'CODE BERKANO: The known situation receives a new living shape.' },
    { code: 'EHWAZ', label: 'Paired Motion', text: 'CODE EHWAZ: Two vectors synchronize and begin moving as one field.' },
    { code: 'MANNAZ', label: 'Human Factor', text: 'CODE MANNAZ: Names carry the social key of the artifact.' },
    { code: 'LAGUZ', label: 'Deep Flow', text: 'CODE LAGUZ: Intuition becomes a navigable current.' },
    { code: 'INGWAZ', label: 'Cycle Closure', text: 'CODE INGWAZ: Hesitation closes and the event becomes whole.' },
    { code: 'OTHALA', label: 'Held Value', text: 'CODE OTHALA: The decision becomes something that can be kept.' },
    { code: 'DAGAZ', label: 'Dawn Shift', text: 'CODE DAGAZ: A new phase begins from the marked moment.' }
  ]
} as const;

export type LegendLevel = keyof typeof LEGEND_ATLAS;
