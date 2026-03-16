export type TipoCaptacao = 'venda' | 'locacao' | '';
export type TipoImovel = 
  | 'andar corporativo' 
  | 'apartamento' 
  | 'casa' 
  | 'cobertura' 
  | 'conjunto' 
  | 'flat'
  | 'galpão' 
  | 'loja' 
  | 'ponto' 
  | 'sala' 
  | 'sítio' 
  | 'sobrado' 
  | 'studio' 
  | 'terreno' 
  | '';

export interface FormData {
  tipoCaptacao: TipoCaptacao;
  tipoImovel: TipoImovel;
  
  // Proprietário
  nomeProprietario: string;
  cpfCnpj: string;
  celular: string;
  email: string;

  // Imóvel
  enderecoCompleto: string;
  numero: string;
  bairro: string;
  cep: string;
  numeroUnidade?: string;
  areaUtil?: string;
  areaTotal?: string;
  areaTerreno?: string;
  vagas?: string;
  dormitorios?: string;
  suites?: string;
  banheiros?: string;
  peDireito?: string;
  topografia?: string;
  temNascente?: boolean;
  temMataNativa?: boolean;
  diferenciais: string[];

  // Venda
  valorVenda?: string;
  numeroMatricula?: string;
  aceitaProposta?: string;
  aceitaPermuta?: string;
  imovelFinanciado?: string;

  // Locação
  valorAluguel?: string;
  valorCondominio?: string;
  valorIptu?: string;
  garantiasAceitas: string[];
  mobiliado?: string;

  // Extras
  observacoes?: string;
  autorizaDivulgacao: boolean;
}
