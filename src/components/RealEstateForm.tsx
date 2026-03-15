import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  User, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Plus,
  Info,
  Building2,
  Key
} from 'lucide-react';
import { cn, maskCurrency, maskCPFCNPJ, maskPhone, maskCEP } from '../utils';
import { FormData, TipoCaptacao, TipoImovel } from '../types';

const TIPO_IMOVEL_OPTIONS = [
  'Andar corporativo', 'Apartamento', 'Casa', 'Cobertura', 'Conjunto', 
  'Galpão', 'Loja', 'Ponto', 'Sala', 'Sítio', 'Sobrado', 'Studio', 'Terreno'
];

const DIFERENCIAIS_MAP: Record<string, string[]> = {
  'Ar condicionado': ['apartamento', 'casa', 'cobertura', 'conjunto', 'loja', 'sala', 'studio', 'andar corporativo'],
  'Aquecimento a gás': ['apartamento', 'casa', 'cobertura', 'sobrado', 'studio'],
  'Depósito': ['apartamento', 'cobertura', 'casa', 'sobrado', 'conjunto', 'andar corporativo'],
  'Lareira': ['casa', 'sobrado', 'sítio', 'cobertura'],
  'Churrasqueira': ['casa', 'sobrado', 'sítio', 'cobertura', 'apartamento'],
  'Quintal': ['casa', 'sobrado', 'sítio', 'terreno', 'loja'],
  'Piscina': ['casa', 'sobrado', 'sítio', 'cobertura', 'apartamento'],
  'Varanda': ['apartamento', 'cobertura', 'casa', 'sobrado', 'studio'],
  'Varanda Gourmet': ['apartamento', 'cobertura'],
  'Vista Panorâmica': ['apartamento', 'cobertura', 'casa', 'sobrado'],
  'Armários Planejados': ['apartamento', 'casa', 'cobertura', 'studio', 'sobrado'],
  'Closet': ['apartamento', 'casa', 'cobertura', 'sobrado'],
  'Lavabo': ['apartamento', 'casa', 'cobertura', 'sobrado', 'conjunto', 'sala'],
  'Cozinha Americana': ['apartamento', 'casa', 'studio', 'sobrado'],
  'Piso de Madeira / Porcelanato': ['apartamento', 'casa', 'cobertura', 'sobrado', 'studio'],
  'Fechadura Eletrônica': ['apartamento', 'casa', 'studio', 'sobrado', 'conjunto', 'sala'],
  'Mobiliado (Porteira Fechada)': ['apartamento', 'casa', 'cobertura', 'studio', 'sobrado'],
  'Sacada': ['apartamento', 'cobertura', 'studio'],
  'Aceita pet': ['apartamento', 'casa', 'cobertura', 'sobrado', 'sítio', 'studio'],
  'Piso Elevado': ['andar corporativo', 'conjunto'],
  'Forro Rebaixado / Mineral': ['andar corporativo', 'conjunto', 'sala'],
  'Ar Condicionado Central': ['andar corporativo', 'conjunto'],
  'Gerador de Energia': ['andar corporativo', 'conjunto', 'casa', 'sobrado'],
  'Copa': ['andar corporativo', 'conjunto', 'sala', 'loja'],
  'Sala de CPD': ['andar corporativo', 'conjunto'],
  'Recepção': ['andar corporativo', 'conjunto', 'sala'],
  'Cerca Elétrica': ['casa', 'sobrado', 'sítio', 'terreno'],
  'Câmeras de Monitoramento': ['casa', 'sobrado', 'sítio', 'apartamento', 'cobertura'],
  'Alarme Monitorado': ['casa', 'sobrado', 'sítio'],
  'Portão Eletrônico': ['casa', 'sobrado', 'sítio', 'loja'],
  'Interfone com Vídeo': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Energia Solar (Fotovoltaica)': ['casa', 'sobrado', 'sítio', 'terreno'],
  'Aquecimento Solar': ['casa', 'sobrado', 'sítio', 'cobertura'],
  'Cisterna / Reuso de Água': ['casa', 'sobrado', 'sítio', 'terreno'],
  'Espaço Gourmet': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Edícula': ['casa', 'sobrado', 'sítio'],
  'Horta / Pomar': ['casa', 'sobrado', 'sítio', 'terreno'],
  'Sauna': ['casa', 'sobrado', 'cobertura', 'apartamento'],
  'Solarium': ['casa', 'sobrado', 'cobertura', 'apartamento'],
  'Escritório / Home Office': ['casa', 'sobrado', 'apartamento', 'cobertura', 'studio'],
  'Entrada Lateral': ['casa', 'sobrado', 'loja'],
  'Dependência de Empregada': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Lavanderia Separada': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Vagas Cobertas': ['casa', 'sobrado', 'apartamento', 'cobertura'],
};

const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2 bg-orange-50 rounded-lg text-brand-orange">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    </div>
    <p className="text-sm text-slate-500 ml-11">{description}</p>
  </div>
);

const InputField = ({ label, name, required, placeholder, type = "text", mask, control, errors }: any) => (
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
            errors[name as keyof FormData] ? "border-red-300 bg-red-50" : "border-slate-200"
          )}
        />
      )}
    />
    {errors[name as keyof FormData] && (
      <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[name as keyof FormData]?.message as string}
      </span>
    )}
  </div>
);

const SelectField = ({ label, name, options, required, register, errors }: any) => (
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
          errors[name as keyof FormData] ? "border-red-300 bg-red-50" : "border-slate-200"
        )}
      >
        <option value="">Selecione</option>
        {options.map((opt: any) => {
          const value = typeof opt === 'string' ? opt.toLowerCase() : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronRight size={16} className="rotate-90" />
      </div>
    </div>
    {errors[name as keyof FormData] && (
      <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[name as keyof FormData]?.message as string}
      </span>
    )}
  </div>
);

export default function RealEstateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, watch, control, setValue, trigger, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tipoCaptacao: '',
      tipoImovel: '',
      nomeProprietario: '',
      cpfCnpj: '',
      celular: '',
      email: '',
      enderecoCompleto: '',
      bairro: '',
      cep: '',
      numeroUnidade: '',
      areaUtil: '',
      areaTotal: '',
      vagas: '',
      dormitorios: '',
      suites: '',
      banheiros: '',
      diferenciais: [],
      valorVenda: '',
      numeroMatricula: '',
      aceitaProposta: '',
      aceitaPermuta: '',
      valorAluguel: '',
      valorCondominio: '',
      valorIptu: '',
      garantiasAceitas: [],
      observacoes: '',
      autorizaDivulgacao: false
    }
  });

  const tipoCaptacao = watch('tipoCaptacao');
  const tipoImovel = watch('tipoImovel');
  const cep = watch('cep');

  // CEP Autocomplete
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = cep?.replace(/\D/g, '');
      if (cleanCep?.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setValue('enderecoCompleto', `${data.logradouro}`);
            setValue('bairro', data.bairro);
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      }
    };
    fetchAddress();
  }, [cep, setValue]);

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof FormData)[]> = {
      1: ['tipoCaptacao', 'tipoImovel'],
      2: ['nomeProprietario', 'cpfCnpj', 'celular', 'email'],
      3: ['enderecoCompleto', 'bairro', 'cep'],
    };

    const fieldsToValidate = fieldsByStep[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'URL_NAO_CONFIGURADA';
    console.log('🚀 Iniciando envio para n8n...');
    console.log('📍 Endpoint:', WEBHOOK_URL);

    try {
      if (!WEBHOOK_URL || WEBHOOK_URL === 'URL_NAO_CONFIGURADA') {
        console.error('❌ ERRO: A URL do Webhook não foi encontrada no arquivo .env');
        throw new Error('URL do Webhook não configurada');
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          dataEnvio: new Date().toISOString(),
          origem: 'Formulário de Captação Web'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados para o servidor');
      }

      setSubmitStatus('success');
      // Opcional: Resetar o formulário após sucesso
      // reset(); 
      // setCurrentStep(1);
    } catch (error) {
      console.error('Erro na integração:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Objetivo', icon: Key },
    { id: 2, title: 'Proprietário', icon: User },
    { id: 3, title: 'Imóvel', icon: MapPin },
    { id: 4, title: 'Valores', icon: DollarSign },
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Morada Urbana Logo" 
            className="h-32 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ficha de Captação de Imóveis</h1>
        <p className="text-slate-500 mt-2">Morada Urbana - Consultoria Imobiliária</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((s) => (
            <div key={s.id} className={cn(
              "flex flex-col items-center gap-2 transition-all",
              currentStep >= s.id ? "text-brand-orange" : "text-slate-400"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                currentStep === s.id ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-100" : 
                currentStep > s.id ? "bg-orange-50 border-orange-100 text-brand-orange" : "bg-white border-slate-200"
              )}>
                {currentStep > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-orange"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: OBJETIVO */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <SectionHeader 
                icon={Key} 
                title="Qual o objetivo da captação?" 
                description="Selecione o tipo de negócio e a categoria do imóvel."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Tipo de captação" 
                  name="tipoCaptacao" 
                  options={[
                    { value: 'venda', label: 'Venda' }, 
                    { value: 'locacao', label: 'Locação' }
                  ]} 
                  required 
                  register={register} 
                  errors={errors} 
                />
                <SelectField label="Tipo de imóvel" name="tipoImovel" options={TIPO_IMOVEL_OPTIONS} required register={register} errors={errors} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROPRIETARIO */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <SectionHeader 
                icon={User} 
                title="Dados do Proprietário" 
                description="Como podemos entrar em contato com o responsável?"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nome completo" name="nomeProprietario" required placeholder="Ex: João Silva" control={control} errors={errors} />
                <InputField label="CPF ou CNPJ" name="cpfCnpj" required mask={maskCPFCNPJ} placeholder="000.000.000-00" control={control} errors={errors} />
                <InputField label="Celular / WhatsApp" name="celular" required mask={maskPhone} placeholder="(00) 00000-0000" control={control} errors={errors} />
                <InputField label="E-mail" name="email" type="email" required placeholder="joao@exemplo.com" control={control} errors={errors} />
              </div>
            </motion.div>
          )}

          {/* STEP 3: IMOVEL */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <SectionHeader 
                icon={MapPin} 
                title="Localização e Detalhes" 
                description="Onde o imóvel está localizado?"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="CEP" name="cep" required mask={maskCEP} placeholder="00000-000" control={control} errors={errors} />
                <InputField label="Bairro" name="bairro" required control={control} errors={errors} />
                <div className="md:col-span-2">
                  <InputField label="Endereço completo" name="enderecoCompleto" required placeholder="Rua, número, complemento..." control={control} errors={errors} />
                </div>
                
                {['apartamento', 'cobertura', 'studio', 'sala', 'conjunto', 'andar corporativo'].includes(tipoImovel) && (
                  <InputField label="Número da unidade" name="numeroUnidade" placeholder="Ex: 82" control={control} errors={errors} />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <InputField label="Área útil (m²)" name="areaUtil" type="number" control={control} errors={errors} />
                <InputField label="Área total (m²)" name="areaTotal" type="number" control={control} errors={errors} />
                
                {!['terreno', 'galpão', 'loja', 'ponto'].includes(tipoImovel) && (
                  <>
                    <InputField label="Vagas" name="vagas" type="number" control={control} errors={errors} />
                    {['apartamento', 'casa', 'cobertura', 'sobrado', 'studio', 'sítio'].includes(tipoImovel) && (
                      <>
                        <InputField label="Dormitórios" name="dormitorios" type="number" control={control} errors={errors} />
                        <InputField label="Suítes" name="suites" type="number" control={control} errors={errors} />
                      </>
                    )}
                    <InputField label="Banheiros" name="banheiros" type="number" control={control} errors={errors} />
                  </>
                )}
              </div>

              {/* Diferenciais */}
              {tipoImovel && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-brand-orange" />
                    Diferenciais do Imóvel
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(DIFERENCIAIS_MAP)
                      .filter(([_, types]) => types.includes(tipoImovel))
                      .map(([label]) => (
                        <label key={label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-orange/30 hover:bg-orange-50/30 transition-all cursor-pointer group">
                          <input 
                            type="checkbox" 
                            value={label} 
                            {...register('diferenciais')} 
                            className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" 
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: VALORES E FINALIZACAO */}
          {currentStep === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Conditional Values */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <SectionHeader 
                  icon={DollarSign} 
                  title={tipoCaptacao === 'venda' ? "Valores de Venda" : "Valores de Locação"} 
                  description="Defina as condições comerciais."
                />
                
                {tipoCaptacao === 'venda' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Valor de venda" name="valorVenda" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <InputField label="Condomínio" name="valorCondominio" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <InputField label="IPTU Mensal" name="valorIptu" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <InputField label="Número da matrícula" name="numeroMatricula" control={control} errors={errors} />
                    
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-slate-700">Aceita proposta?</label>
                      <div className="flex gap-4">
                        {['Sim', 'Não'].map(val => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={val} {...register('aceitaProposta')} className="accent-brand-orange" />
                            <span className="text-sm text-slate-600">{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-slate-700">Aceita permuta?</label>
                      <div className="flex gap-4">
                        {['Sim', 'Não'].map(val => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={val} {...register('aceitaPermuta')} className="accent-brand-orange" />
                            <span className="text-sm text-slate-600">{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Valor do aluguel" name="valorAluguel" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <InputField label="Condomínio" name="valorCondominio" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <InputField label="IPTU Mensal" name="valorIptu" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                  </div>
                )}

                {tipoCaptacao === 'locacao' && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-brand-orange" />
                      Garantias Aceitas
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Seguro Fiança', 'Fiador', 'Título de Capitalização', 'Depósito Caução'].map(garantia => (
                        <label key={garantia} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-orange/30 hover:bg-orange-50/30 transition-all cursor-pointer group">
                          <input 
                            type="checkbox" 
                            value={garantia} 
                            {...register('garantiasAceitas')} 
                            className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" 
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{garantia}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Final Auth */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <SectionHeader icon={Info} title="Finalização" description="Autorização e observações." />
                <div className="space-y-6">
                  <textarea 
                    {...register('observacoes')}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/10 focus:border-brand-orange transition-all"
                    placeholder="Observações adicionais..."
                  />
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="flex gap-4 cursor-pointer">
                      <input type="checkbox" {...register('autorizaDivulgacao', { required: true })} className="w-5 h-5 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" />
                      <span className="text-sm text-slate-600">Autorizo a Morada Urbana a divulgar o imóvel.</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Voltar
            </button>
          ) : <div />}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-orange text-white rounded-xl font-semibold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              Próximo Passo
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-brand-orange text-white rounded-xl font-semibold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Captação'}
              <CheckCircle2 size={18} />
            </button>
          )}
        </div>

        {submitStatus === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-medium">
            Ficha enviada com sucesso! Nossa equipe entrará em contato.
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium">
            Erro ao enviar. Verifique se a URL no console (F12) está correta.
          </motion.div>
        )}

        <div className="text-center mt-8 pt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Versão: 2.0 - Webhook Ativo 🚀
          </p>
        </div>
      </form>
    </div>
  );
}
