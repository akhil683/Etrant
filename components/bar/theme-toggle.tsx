import { Switch } from "../ui/switch";
import { useTheme } from "../providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        Dark mode
      </span>
      <Switch checked={isDark} onCheckedChange={toggleTheme} aria-readonly />
    </div>
  );
}
