import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '../utils';

interface FormSelectProps {
  label: string;
  name: string;
  options: (string | { value: string; label: string })[];
  required?: boolean;
  register: any;
  errors: any;
}

const FormSelect = React.memo(({ 
  label, 
  name, 
  options, 
  required, 
  register, 
  errors 
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          {...register(name, { required: required ? "Campo obrigatório" : false })}
          className={cn(
            "w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all appearance-none",
            "focus:ring-2 focus:ring-brand-orange/10 focus:border-brand-orange",
            errors[name] ? "border-red-300 bg-red-50" : "border-slate-200"
          )}
        >
          <option value="">Selecione</option>
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt.toLowerCase() : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return <option key={value} value={value}>{label}</option>;
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronRight size={16} className="rotate-90" />
        </div>
      </div>
      {errors[name] && (
        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';
export default FormSelect;