"use client";

/**
 * External dependencies.
 */
import { SettingsIcon, VenetianMaskIcon } from "lucide-react";

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
      {settings.isIncognito && <VenetianMaskIcon size={16} />}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <SettingsIcon size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Adjust your settings and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Incognito */}
            <div className="grid grid-cols-4 items-center gap-4 w-full">
              <Label htmlFor="username" className="col-span-1">
                Incognito
              </Label>
              <Select
                value={settings._isIncognito ? "enable" : "disable"}
                onValueChange={(value) =>
                  handleValueChange("_isIncognito", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choose whether to enable incognito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="disable">Disable</SelectItem>
                    <SelectItem value="enable">Enable</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Context Size */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="context-size">Context Size</Label>
              <Input
                id="context-size"
                onInput={(e) =>
                  handleValueChange("_contextSize", e.target.value)
                }
                value={settings._contextSize}
                className="col-span-3"
                type="number"
                min="64"
                max="4096"
              />
            </div>

            {/* GPU Layers */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gpu-layers">GPU Layers</Label>
              <Input
                id="gpu-layers"
                onInput={(e) => handleValueChange("_gpuLayers", e.target.value)}
                value={settings._gpuLayers}
                className="col-span-3"
                type="number"
                min="0"
                max="48"
              />
            </div>

            {/* Temperature */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                onInput={(e) =>
                  handleValueChange("_temperature", e.target.value)
                }
                value={settings._temperature}
                className="col-span-3"
                type="number"
                min="0"
                max="2"
                step="0.1"
              />
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
