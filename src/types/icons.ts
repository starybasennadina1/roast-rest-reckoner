import type { Check } from 'lucide-react-native';

/**
 * lucide-react-native does not export its `LucideIcon` type, so derive it
 * from one icon. `import type` is erased at build time — nothing is bundled.
 */
export type LucideIcon = typeof Check;
