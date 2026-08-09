"use client";

/**
 * External dependencies.
 */
import { useId } from "react";
import { RotateCcwIcon, Settings2Icon, VenetianMaskIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { clampSetting, SETTINGS_FIELDS } from "@/lib/settings";
import useSettings from "@/hooks/useSettings";

/**
 * A numeric model parameter, editable either by dragging or by typing.
 */
const SettingControl = ({ name, value, error, onChange }) => {
  const { label, unit, min, max, step, description } = SETTINGS_FIELDS[name];
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <Field>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel htmlFor={id} className="text-sm">
          {label}
        </FieldLabel>

        <InputGroup className="w-34 shrink-0">
          <InputGroupInput
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(name, event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${descriptionId} ${errorId}` : descriptionId}
            className="tabular-nums"
          />
          {unit && (
            <InputGroupAddon align="inline-end">
              <InputGroupText className="text-xs">{unit}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      <Slider
        value={[clampSetting(name, value)]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(name, next)}
        aria-label={`${label} slider`}
        className="py-1"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <FieldDescription id={descriptionId}>{description}</FieldDescription>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
};

/**
 * Model and privacy settings.
 *
 * @param {Object} props Component props.
 * @param {"sidebar"|"icon"} props.variant How the trigger should be rendered.
 */
export const Settings = ({ variant = "icon" }) => {
  const {
    draft,
    errors,
    isValid,
    isDirty,
    isOpen,
    handleOpenChange,
    handleValueChange,
    handleReset,
    handleSettingsSubmit,
  } = useSettings();

  const trigger =
    variant === "sidebar" ? (
      <Button
        variant="ghost"
        className="h-8 flex-1 justify-start gap-2 px-2 font-normal text-muted-foreground hover:text-foreground"
      >
        <Settings2Icon />
        Settings
      </Button>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Open settings">
            <Settings2Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[90svh] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Tune how the local model runs. Changes apply to your next message.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            handleSettingsSubmit();
          }}
        >
          <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <FieldGroup className="gap-6">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="incognito" className="text-sm">
                    <VenetianMaskIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Incognito
                  </FieldLabel>
                  <FieldDescription>
                    Keep new messages in this session only — nothing is written to the
                    history folder.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="incognito"
                  checked={Boolean(draft.isIncognito)}
                  onCheckedChange={(checked) =>
                    handleValueChange("isIncognito", checked)
                  }
                />
              </Field>

              <FieldSeparator />

              <SettingControl
                name="contextSize"
                value={draft.contextSize}
                error={errors.contextSize}
                onChange={handleValueChange}
              />

              <SettingControl
                name="gpuLayers"
                value={draft.gpuLayers}
                error={errors.gpuLayers}
                onChange={handleValueChange}
              />

              <SettingControl
                name="temperature"
                value={draft.temperature}
                error={errors.temperature}
                onChange={handleValueChange}
              />
            </FieldGroup>
          </div>

          <DialogFooter className="border-t px-6 py-4 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcwIcon />
              Reset to defaults
            </Button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!isValid || !isDirty}>
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
