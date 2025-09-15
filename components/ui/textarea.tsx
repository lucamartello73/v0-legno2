"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  helperText?: string
  characterLimit?: number
}

function Textarea({ className, label, helperText, characterLimit, ...props }: TextareaProps) {
  const [characterCount, setCharacterCount] = React.useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterCount(e.target.value.length)
    props.onChange?.(e)
  }

  React.useEffect(() => {
    if (props.value) {
      setCharacterCount(String(props.value).length)
    }
  }, [props.value])

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          data-slot="textarea"
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y",
            characterLimit && "pb-8",
            className,
          )}
          {...props}
          onChange={handleChange}
        />
        {characterLimit && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            <span className={characterCount > characterLimit ? "text-red-500" : ""}>{characterCount}</span>/
            {characterLimit}
          </div>
        )}
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}

export { Textarea }
