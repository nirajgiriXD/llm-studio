"use client";

/**
 * External dependencies.
 */
import { SettingsIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSettings from "@/hooks/useSettings";

export const Settings = () => {
  const {
    settings,
    isOpen,
    setIsOpen,
    handleValueChange,
    handleSettingsSubmit,
  } = useSettings();

  return (
    <div className="flex gap-4 items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <SettingsIcon size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Adjust your settings and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:gap-6 py-2">
            {/* Incognito */}
            <div className="grid gap-2 w-full">
              <Label htmlFor="incognito">Incognito</Label>
              <Select
                value={settings._isIncognito ? "enable" : "disable"}
                onValueChange={(value) =>
                  handleValueChange("_isIncognito", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose whether to enable incognito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="disable">Disable</SelectItem>
                    <SelectItem value="enable">Enable</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Enable incognito mode to prevent your messages from being
                stored.
              </p>
            </div>

            {/* Context Size */}
            <div className="grid gap-2">
              <Label htmlFor="context-size">
                Context Size{" "}
                <span className="text-muted-foreground text-xs">(64 - 4096)</span>
              </Label>
              <Input
                id="context-size"
                onInput={(e) =>
                  handleValueChange("_contextSize", e.target.value)
                }
                value={settings._contextSize}
                type="number"
                min="64"
                max="4096"
              />
              <p className="text-xs text-muted-foreground">
                Specifies the maximum number of tokens the model can process in
                a single session or context window; if set too high, it may
                cause performance issues or crashes, so keep it lower (e.g.,
                512-1024) if you face problems.
              </p>
            </div>

            {/* GPU Layers */}
            <div className="grid gap-2">
              <Label htmlFor="gpu-layers">
                GPU Layers{" "}
                <span className="text-muted-foreground text-xs">(0 - 64)</span>
              </Label>
              <Input
                id="gpu-layers"
                onInput={(e) => handleValueChange("_gpuLayers", e.target.value)}
                value={settings._gpuLayers}
                type="number"
                min="0"
                max="64"
              />
              <p className="text-xs text-muted-foreground">
                Determines the number of model layers offloaded to the GPU for
                faster processing; setting it too high may exceed GPU memory, so
                use a smaller value (e.g., 10-20) if the model crashes.
              </p>
            </div>

            {/* Temperature */}
            <div className="grid gap-2">
              <Label htmlFor="temperature">
                Temperature{" "}
                <span className="text-muted-foreground text-xs">(0 - 2)</span>
              </Label>
              <Input
                id="temperature"
                onInput={(e) =>
                  handleValueChange("_temperature", e.target.value)
                }
                value={settings._temperature}
                type="number"
                min="0"
                max="2"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground">
                Controls the randomness of the model&apos;s output; lower values
                (e.g., 0.2-0.5) make responses more deterministic, while higher
                values (e.g., 0.7-1.0) increase diversity.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSettingsSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
