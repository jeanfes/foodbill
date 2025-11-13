
import { ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Button } from './button';
import { Input } from './input';

export interface NumberInputProps
    extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
    /**
     * Tamaño del paso al incrementar/decrementar.
     * Alias: step. Si ambos se proveen, tiene prioridad `step`.
     */
    stepper?: number;
    step?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    value?: number; // Controlled value
    suffix?: string;
    prefix?: string;
    onValueChange?: (value: number | undefined) => void;
    fixedDecimalScale?: boolean;
    decimalScale?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            stepper,
            step,
            thousandSeparator,
            decimalSeparator,
            placeholder,
            defaultValue,
            min = -Infinity,
            max = Infinity,
            onValueChange,
            fixedDecimalScale = false,
            decimalScale = 0,
            suffix,
            prefix,
            value: controlledValue,
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState<number | undefined>(
            controlledValue ?? defaultValue
        );

        const stepSize = useMemo(() => (step ?? stepper ?? 1), [step, stepper]);

        const handleIncrement = useCallback(() => {
            setValue((prev) =>
                prev === undefined ? stepSize : Math.min((prev ?? 0) + stepSize, max)
            );
        }, [stepSize, max]);

        const handleDecrement = useCallback(() => {
            setValue((prev) =>
                prev === undefined
                    ? -stepSize
                    : Math.max((prev ?? 0) - stepSize, min)
            );
        }, [stepSize, min]);

        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (
                    document.activeElement ===
                    (ref as React.RefObject<HTMLInputElement>).current
                ) {
                    if (e.key === 'ArrowUp') {
                        handleIncrement();
                    } else if (e.key === 'ArrowDown') {
                        handleDecrement();
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }, [handleIncrement, handleDecrement, ref]);

        useEffect(() => {
            if (controlledValue !== undefined) {
                setValue(controlledValue);
            }
        }, [controlledValue]);

        const handleChange = (values: {
            value: string;
            floatValue: number | undefined;
        }) => {
            const newValue =
                values.floatValue === undefined ? undefined : values.floatValue;
            setValue(newValue);
            if (onValueChange) {
                onValueChange(newValue);
            }
        };

        const handleBlur = () => {
            if (value !== undefined) {
                if (value < min) {
                    setValue(min);
                    (ref as React.RefObject<HTMLInputElement>).current!.value =
                        String(min);
                } else if (value > max) {
                    setValue(max);
                    (ref as React.RefObject<HTMLInputElement>).current!.value =
                        String(max);
                }
            }
        };

        return (
            <div className="inline-flex items-stretch h-10">
                <NumericFormat
                    value={value}
                    onValueChange={handleChange}
                    thousandSeparator={thousandSeparator}
                    decimalSeparator={decimalSeparator ?? (thousandSeparator === '.' ? ',' : undefined)}
                    decimalScale={decimalScale}
                    fixedDecimalScale={fixedDecimalScale}
                    allowNegative={min < 0}
                    valueIsNumericString
                    onBlur={handleBlur}
                    max={max}
                    min={min}
                    suffix={suffix}
                    prefix={prefix}
                    customInput={Input}
                    placeholder={placeholder}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative h-10"
                    getInputRef={ref}
                    {...props}
                />

                <div className="flex flex-col h-10">
                    <Button
                        aria-label="Increase value"
                        className="px-2 h-1/2 rounded-l-none rounded-b-none border-input border-l-0 border-b focus-visible:relative"
                        variant="outline"
                        onClick={handleIncrement}
                        disabled={value !== undefined && value >= max}
                    >
                        <ChevronUp size={15} />
                    </Button>
                    <Button
                        aria-label="Decrease value"
                        className="px-2 h-1/2 rounded-l-none rounded-t-none border-input border-l-0 border-t focus-visible:relative"
                        variant="outline"
                        onClick={handleDecrement}
                        disabled={value !== undefined && value <= min}
                    >
                        <ChevronDown size={15} />
                    </Button>
                </div>
            </div>
        );
    }
);
