import React from 'react';
import { Controller } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '../utils';

interface FormInputProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  mask?: (val: string) => string;
  control: any;
  errors: any;
}

const FormInput = React.memo(({ 
  label, 
  name, 
  required, 
  placeholder, 
  type = "text", 
  mask, 
  control, 
  errors 
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "Campo obrigatório" : false }}
        render={({ field }) => (
          <input
            {...field}
            value={field.value ?? ''}
            type={type}
            placeholder={placeholder}
            onChange={(e) => {
              const val = mask ? mask(e.target.value) : e.target.value;
              field.onChange(val);
            }}
            className={cn(
              "w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all",
              "focus:ring-2 focus:ring-brand-orange/10 focus:border-brand-orange",
              errors[name] ? "border-red-300 bg-red-50" : "border-slate-200"
            )}
          />
        )}
      />
      {errors[name] && (
        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';
export default FormInput;