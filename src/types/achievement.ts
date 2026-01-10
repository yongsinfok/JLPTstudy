export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
}
