import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  User, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Info,
  Key
} from 'lucide-react';
import { cn, maskCurrency, maskCPFCNPJ, maskPhone, maskCEP } from '../utils';
import { FormData } from '../types';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { Controller } from 'react-hook-form';

const TIPO_IMOVEL_OPTIONS = [
  'Andar corporativo', 'Apartamento', 'Casa', 'Cobertura', 'Conjunto', 'Flat',
  'Galpão', 'Loja', 'Ponto', 'Sala', 'Sítio', 'Sobrado', 'Studio', 'Terreno'
];

const DIFERENCIAIS_MAP: Record<string, string[]> = {
  'Ar condicionado': ['apartamento', 'casa', 'cobertura', 'conjunto', 'loja', 'sala', 'studio', 'andar corporativo', 'ponto', 'flat'],
  'Aquecimento a gás': ['apartamento', 'casa', 'cobertura', 'sobrado', 'studio', 'flat'],
  'Depósito': ['apartamento', 'cobertura', 'casa', 'sobrado', 'conjunto', 'andar corporativo', 'galpão', 'loja', 'ponto', 'flat'],
  'Lareira': ['casa', 'sobrado', 'sítio', 'cobertura'],
  'Churrasqueira': ['casa', 'sobrado', 'sítio', 'cobertura', 'apartamento', 'flat'],
  'Quintal': ['casa', 'sobrado', 'sítio', 'terreno', 'loja', 'ponto'],
  'Piscina': ['casa', 'sobrado', 'sítio', 'cobertura', 'apartamento', 'flat'],
  'Varanda': ['apartamento', 'cobertura', 'casa', 'sobrado', 'studio', 'sítio', 'flat'],
  'Varanda Gourmet': ['apartamento', 'cobertura', 'sítio', 'flat'],
  'Vista Panorâmica': ['apartamento', 'cobertura', 'casa', 'sobrado', 'sítio', 'flat'],
  'Armários Planejados': ['apartamento', 'casa', 'cobertura', 'studio', 'sobrado', 'flat'],
  'Closet': ['apartamento', 'casa', 'cobertura', 'sobrado', 'flat'],
  'Lavabo': ['apartamento', 'casa', 'cobertura', 'sobrado', 'conjunto', 'sala', 'loja', 'ponto', 'flat'],
  'Cozinha Americana': ['apartamento', 'casa', 'studio', 'sobrado', 'flat'],
  'Piso de Madeira / Porcelanato': ['apartamento', 'casa', 'cobertura', 'sobrado', 'studio', 'flat'],
  'Fechadura Eletrônica': ['apartamento', 'casa', 'studio', 'sobrado', 'conjunto', 'sala', 'loja', 'ponto', 'flat'],
  'Mobiliado (Porteira Fechada)': ['apartamento', 'casa', 'cobertura', 'studio', 'sobrado', 'flat'],
  'Sacada': ['apartamento', 'cobertura', 'studio', 'flat'],
  'Aceita pet': ['apartamento', 'casa', 'cobertura', 'sobrado', 'sítio', 'studio', 'flat'],
  'Piso Elevado': ['andar corporativo', 'conjunto', 'sala'],
  'Forro Rebaixado / Mineral': ['andar corporativo', 'conjunto', 'sala'],
  'Ar Condicionado Central': ['andar corporativo', 'conjunto', 'sala'],
  'Gerador de Energia': ['andar corporativo', 'conjunto', 'casa', 'sobrado', 'loja', 'ponto', 'sítio'],
  'Copa': ['andar corporativo', 'conjunto', 'sala', 'loja', 'ponto'],
  'Sala de CPD': ['andar corporativo', 'conjunto', 'sala'],
  'Recepção': ['andar corporativo', 'conjunto', 'sala', 'loja', 'ponto'],
  'Cerca Elétrica': ['casa', 'sobrado', 'sítio', 'terreno', 'galpão', 'loja', 'ponto'],
  'Câmeras de Monitoramento': ['casa', 'sobrado', 'sítio', 'apartamento', 'cobertura', 'galpão', 'loja', 'ponto', 'sala'],
  'Alarme Monitorado': ['casa', 'sobrado', 'sítio', 'galpão', 'loja', 'ponto', 'sala'],
  'Portão Eletrônico': ['casa', 'sobrado', 'sítio', 'loja', 'galpão', 'ponto'],
  'Interfone com Vídeo': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Energia Solar (Fotovoltaica)': ['casa', 'sobrado', 'sítio', 'terreno', 'galpão'],
  'Aquecimento Solar': ['casa', 'sobrado', 'sítio', 'cobertura', 'galpão'],
  'Cisterna / Reuso de Água': ['casa', 'sobrado', 'sítio', 'terreno', 'galpão'],
  'Espaço Gourmet': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Edícula': ['casa', 'sobrado', 'sítio'],
  'Horta / Pomar': ['casa', 'sobrado', 'sítio', 'terreno'],
  'Sauna': ['casa', 'sobrado', 'cobertura', 'apartamento'],
  'Solarium': ['casa', 'sobrado', 'cobertura', 'apartamento'],
  'Escritório / Home Office': ['casa', 'sobrado', 'apartamento', 'cobertura', 'studio', 'galpão'],
  'Entrada Lateral': ['casa', 'sobrado', 'loja', 'galpão', 'ponto'],
  'Dependência de Empregada': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Lavanderia Separada': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Vagas Cobertas': ['casa', 'sobrado', 'apartamento', 'cobertura'],
  'Pé Direito Elevado': ['galpão'],
  'Piso de Alta Resistência': ['galpão'],
  'Docas': ['galpão'],
  'Pátio de Manobra': ['galpão'],
  'Energia Trifásica': ['galpão'],
  'Ponte Rolante': ['galpão'],
  'Sistema de Sprinklers / Hidrantes': ['galpão'],
  'Iluminação Natural': ['galpão', 'casa', 'sobrado'],
  'Mezanino': ['galpão', 'loja', 'conjunto'],
  'Vestiários': ['galpão', 'andar corporativo'],
  'Refeitório': ['galpão', 'andar corporativo'],
  'Guarita / Portaria Blindada': ['galpão', 'terreno', 'casa'],
  'Área de Carga e Descarga Coberta': ['galpão', 'loja', 'ponto'],
  'Vitrine Ampla': ['loja', 'ponto'],
  'Pé Direito Duplo': ['loja', 'ponto', 'casa', 'sobrado'],
  'Porta de Enrolar Automática': ['loja', 'ponto'],
  'Fachada Moderna': ['loja', 'ponto', 'sala', 'andar corporativo'],
  'Banheiro PNE': ['loja', 'ponto', 'sala', 'andar corporativo', 'conjunto'],
  'Iluminação em LED': ['loja', 'ponto', 'sala', 'apartamento', 'casa'],
  'Divisórias Instaladas': ['sala', 'conjunto', 'andar corporativo'],
  'Cabeamento Estruturado': ['sala', 'conjunto', 'andar corporativo'],
  'Forro Acústico': ['sala', 'conjunto', 'andar corporativo'],
  'Sala de Reunião Privativa': ['sala', 'conjunto', 'andar corporativo'],
  'Banheiro Privativo': ['sala', 'conjunto', 'loja', 'ponto'],
  'Vista Privilegiada': ['sala', 'conjunto', 'andar corporativo', 'apartamento', 'cobertura'],
  'Vagas para Clientes': ['loja', 'ponto', 'sala', 'conjunto'],
  'Estacionamento Rotativo': ['sala', 'conjunto', 'loja', 'ponto', 'andar corporativo'],
  'Casa Sede': ['sítio'],
  'Casa de Caseiro': ['sítio'],
  'Poço Artesiano': ['sítio', 'terreno'],
  'Curral': ['sítio'],
  'Pasto': ['sítio'],
  'Lago / Rio': ['sítio', 'terreno'],
  'Estábulo': ['sítio'],
  'Galinheiro': ['sítio'],
  'Nascente de Água': ['sítio', 'terreno'],
  'Mata Nativa': ['sítio', 'terreno'],
  'Topografia Plana': ['sítio', 'terreno', 'galpão'],
  'Topografia Aclive / Declive': ['sítio', 'terreno'],
  'Acesso Asfaltado': ['sítio', 'terreno', 'galpão'],
  'Acesso de Terra': ['sítio', 'terreno'],
  'Internet Rural / Satélite': ['sítio'],
  'Campo de Futebol': ['sítio', 'casa', 'sobrado'],
  'Tanque de Peixe': ['sítio'],
  'Galpão de Máquinas': ['sítio', 'galpão'],
  'Murado': ['terreno', 'casa', 'sobrado'],
  'Cercado': ['terreno', 'sítio'],
  'Terraplanagem Realizada': ['terreno'],
  'Rede de Esgoto': ['terreno', 'casa', 'sobrado'],
  'Rede de Água': ['terreno', 'casa', 'sobrado'],
  'Rede Elétrica': ['terreno', 'casa', 'sobrado'],
  'Pavimentação': ['terreno', 'galpão'],
  'Escriturado e Registrado': ['terreno', 'sítio', 'casa', 'sobrado', 'apartamento'],
  'Condomínio Fechado': ['terreno', 'casa', 'apartamento', 'sobrado'],
  'Loteamento Aberto': ['terreno'],
  'Iluminação Pública': ['terreno'],
};

const SectionHeader = React.memo(({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2 bg-orange-50 rounded-lg text-brand-orange">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    </div>
    <p className="text-sm text-slate-500 ml-11">{description}</p>
  </div>
));

SectionHeader.displayName = 'SectionHeader';

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
      numero: '',
      bairro: '',
      cep: '',
      numeroUnidade: '',
      areaUtil: '',
      areaTotal: '',
      vagas: '',
      dormitorios: '',
      suites: '',
      banheiros: '',
      areaTerreno: '',
      peDireito: '',
      topografia: '',
      temNascente: false,
      temMataNativa: false,
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
      3: ['enderecoCompleto', 'numero', 'bairro', 'cep'],
    };

    const fieldsToValidate = fieldsByStep[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // URL de Produção como fallback definitivo
    const PROD_URL = 'https://n8n.srv1485851.hstgr.cloud/webhook/notificacao';
    
    // MODO DE TESTE ATIVADO (V4 - FORÇADA)
    const TEST_URL = 'https://n8n.srv1485851.hstgr.cloud/webhook-test/notificacao';
    let WEBHOOK_URL = TEST_URL;
    
    console.log('🔥 V4: MODO DE TESTE ATIVADO - ENVIANDO PARA WEBHOOK-TEST');
    console.log('📍 URL DESTINO:', WEBHOOK_URL);
    
    try {
      if (!WEBHOOK_URL || WEBHOOK_URL === 'URL_NAO_CONFIGURADA') {
        throw new Error('URL do Webhook não configurada');
      }

      // Função auxiliar para limpar valores monetários e áreas (remover R$, pontos e manter apenas números)
      const cleanNumber = (value: any) => {
        if (!value) return 0;
        if (typeof value === 'number') return value;
        const cleaned = value.toString().replace(/\D/g, '');
        return cleaned ? parseInt(cleaned, 10) : 0;
      };

      // Preparamos o objeto de envio
      const payload = {
        ...data,
        // Valores limpos para o Banco de Dados (Supabase)
        valorVenda_num: cleanNumber(data.valorVenda),
        valorLocacao_num: cleanNumber(data.valorAluguel),
        valorCondominio_num: cleanNumber(data.valorCondominio),
        valorIptu_num: cleanNumber(data.valorIptu),
        areaTotal_num: cleanNumber(data.areaTotal),
        areaUtil_num: cleanNumber(data.areaUtil),
        // Mantemos as strings originais caso queira usar em e-mails
        valorVenda: data.valorVenda,
        valorLocacao: data.valorAluguel,
        // Transformamos arrays em texto legível
        diferenciais: data.diferenciais.join(', '),
        garantiasAceitas: data.garantiasAceitas.join(', '),
        dataEnvio: new Date().toLocaleString('pt-BR'),
        origem: 'Formulário Morada Urbana'
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao enviar');

      setSubmitStatus('success');
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
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">Versão 3.1 - DB Ready</span>
        <div className="flex flex-col items-center gap-4 mb-6">
          <img 
            src="/logo.png" 
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
                <FormSelect 
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
                <FormSelect label="Tipo de imóvel" name="tipoImovel" options={TIPO_IMOVEL_OPTIONS} required register={register} errors={errors} />
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
                <FormInput label="Nome completo" name="nomeProprietario" required placeholder="Ex: João Silva" control={control} errors={errors} />
                <FormInput label="CPF ou CNPJ" name="cpfCnpj" required mask={maskCPFCNPJ} placeholder="000.000.000-00" control={control} errors={errors} />
                <FormInput label="Celular / WhatsApp" name="celular" required mask={maskPhone} placeholder="(00) 00000-0000" control={control} errors={errors} />
                <FormInput label="E-mail" name="email" type="email" required placeholder="joao@exemplo.com" control={control} errors={errors} />
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
                <FormInput label="CEP" name="cep" required mask={maskCEP} placeholder="00000-000" control={control} errors={errors} />
                <FormInput label="Bairro" name="bairro" required control={control} errors={errors} />
                <div className="md:col-span-2">
                  <FormInput label="Endereço completo" name="enderecoCompleto" required placeholder="Rua, Avenida, etc..." control={control} errors={errors} />
                </div>
                
                {/* Campo de Número adicionado para melhor organização do banco de dados */}
                <FormInput label="Número" name="numero" required placeholder="Ex: 123" control={control} errors={errors} />

                {['apartamento', 'cobertura', 'flat', 'studio', 'sala', 'conjunto', 'andar corporativo'].includes(tipoImovel) && (
                  <FormInput label="Número da unidade" name="numeroUnidade" placeholder="Ex: 82" control={control} errors={errors} />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <FormInput label="Área útil (m²)" name="areaUtil" type="number" control={control} errors={errors} />
                <FormInput label="Área total (m²)" name="areaTotal" type="number" control={control} errors={errors} />
                
                {['terreno', 'sítio'].includes(tipoImovel) && (
                  <FormInput label="Área do terreno (m²)" name="areaTerreno" type="number" control={control} errors={errors} />
                )}

                {['galpão', 'loja', 'ponto'].includes(tipoImovel) && (
                  <FormInput label="Pé direito (m)" name="peDireito" type="number" control={control} errors={errors} />
                )}

                {tipoImovel === 'terreno' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect 
                      label="Topografia" 
                      name="topografia" 
                      options={[
                        { value: 'plano', label: 'Plano' },
                        { value: 'aclive', label: 'Aclive' },
                        { value: 'declive', label: 'Declive' },
                        { value: 'irregular', label: 'Irregular' }
                      ]} 
                      register={register} 
                      errors={errors} 
                    />
                  </div>
                )}

                {tipoImovel === 'sítio' && (
                  <div className="md:col-span-2 flex gap-8 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={watch('temNascente')}
                        onChange={(e) => setValue('temNascente', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" 
                      />
                      <span className="text-sm text-slate-700">Tem nascente?</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={watch('temMataNativa')}
                        onChange={(e) => setValue('temMataNativa', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" 
                      />
                      <span className="text-sm text-slate-700">Tem mata nativa?</span>
                    </label>
                  </div>
                )}
                
                {!['terreno', 'galpão', 'loja', 'ponto'].includes(tipoImovel) && (
                  <>
                    <FormInput label="Vagas" name="vagas" type="number" control={control} errors={errors} />
                    {['apartamento', 'casa', 'cobertura', 'sobrado', 'studio', 'sítio'].includes(tipoImovel) && (
                      <>
                        <FormInput label="Dormitórios" name="dormitorios" type="number" control={control} errors={errors} />
                        <FormInput label="Suítes" name="suites" type="number" control={control} errors={errors} />
                      </>
                    )}
                    <FormInput label="Banheiros" name="banheiros" type="number" control={control} errors={errors} />
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
                    <FormInput label="Valor de venda" name="valorVenda" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <FormInput label="Condomínio" name="valorCondominio" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <FormInput label="IPTU Mensal" name="valorIptu" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <FormInput label="Número da matrícula" name="numeroMatricula" control={control} errors={errors} />
                    
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-slate-700">Aceita proposta?</label>
                      <Controller
                        name="aceitaProposta"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-4">
                            {['Sim', 'Não'].map(val => (
                              <label key={val} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  value={val} 
                                  checked={field.value === val}
                                  onChange={() => field.onChange(val)}
                                  className="accent-brand-orange" 
                                />
                                <span className="text-sm text-slate-600">{val}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-slate-700">Aceita permuta?</label>
                      <Controller
                        name="aceitaPermuta"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-4">
                            {['Sim', 'Não'].map(val => (
                              <label key={val} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  value={val} 
                                  checked={field.value === val}
                                  onChange={() => field.onChange(val)}
                                  className="accent-brand-orange" 
                                />
                                <span className="text-sm text-slate-600">{val}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput label="Valor do aluguel" name="valorAluguel" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <FormInput label="Condomínio" name="valorCondominio" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
                    <FormInput label="IPTU Mensal" name="valorIptu" mask={maskCurrency} placeholder="R$ 0,00" control={control} errors={errors} />
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
                      <input 
                        type="checkbox" 
                        checked={watch('autorizaDivulgacao')}
                        onChange={(e) => setValue('autorizaDivulgacao', e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" 
                      />
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
