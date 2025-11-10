# ❄️ SNW STORE - Landing Page

Landing page avançada e moderna para revendas no Mercado Livre, com design dark mode elegante, animações suaves com GSAP, modelo 3D interativo e uma experiência de usuário excepcional.

## ✨ Características Principais

- 🎨 **Design Dark Mode Elegante** - Interface moderna com paleta de cores personalizada e background azulado escuro (#0D1118)
- 🎬 **Animações GSAP Avançadas** - Animações suaves e profissionais com ScrollTrigger
- 🎯 **Modelo 3D Interativo** - Snowflake 3D renderizado com Three.js, interativo e animado
- 📱 **Totalmente Responsivo** - Funciona perfeitamente em todos os dispositivos
- ⚡ **Performance Otimizada** - Next.js 14 com App Router e SSR otimizado
- 🎨 **UI/UX Avançado** - Hierarquia visual, gradientes, hovers, glows e efeitos visuais
- 🔍 **SEO Friendly** - Metadados otimizados para mecanismos de busca
- 🚀 **Pronto para Vercel** - Deploy fácil e rápido
- 🎭 **Scrollbar Personalizada** - Scrollbar customizada com cores da paleta
- 🌊 **Shape Dividers** - Dividers SVG personalizados entre seções

## 🚀 Stack Tecnológica

### Core
- **Next.js 14** - Framework React com App Router e SSR
- **TypeScript** - Type safety e desenvolvimento mais seguro
- **React 18** - Biblioteca UI com hooks e componentes modernos

### Estilização
- **Tailwind CSS** - Framework CSS utility-first para estilização rápida
- **CSS Custom Properties** - Variáveis CSS para temas e customizações
- **PostCSS** - Processamento de CSS moderno

### Animações e Efeitos
- **GSAP 3.12** - Biblioteca de animações de alto desempenho
- **ScrollTrigger** - Animações baseadas em scroll
- **Font Awesome** - Ícones profissionais (Solid e Brands)
- **Framer Motion** - Animações complementares (opcional)

### 3D e Gráficos
- **Three.js** - Biblioteca 3D JavaScript
- **@react-three/fiber** - Renderer React para Three.js
- **@react-three/drei** - Helpers e abstrações úteis para Three.js
- **GLB Models** - Modelos 3D em formato binário otimizado

## 🎨 Paleta de Cores

A paleta de cores foi cuidadosamente selecionada para criar uma experiência visual elegante e moderna:

- `#0D1118` - **Background Principal** - Azul escuro profundo
- `#011640` - Primary Dark (Elementos secundários)
- `#011526` - Primary Darkest (Elementos mais escuros)
- `#023859` - Primary Base (Elementos intermediários)
- `#30A9D9` / `#34ABDA` - Primary Light (Destaques, CTAs e scrollbar)
- `#99E2F2` - Primary Lightest (Texto e elementos claros)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos de Instalação

```bash
# 1. Clonar o repositório (ou navegar até a pasta do projeto)
cd Snow

# 2. Instalar dependências
npm install

# 3. Executar em modo desenvolvimento
npm run dev

# 4. Acessar no navegador
# http://localhost:3000

# 5. Build para produção
npm run build

# 6. Executar versão de produção
npm start

# 7. Linting (opcional)
npm run lint
```

## 🏗️ Estrutura do Projeto

```
Snow/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal com metadata
│   ├── page.tsx                 # Página principal
│   └── globals.css              # Estilos globais e animações
│
├── components/                   # Componentes React
│   ├── Header.tsx               # Header fixo com navegação
│   ├── Hero.tsx                 # Seção hero com modelo 3D
│   ├── Model3D.tsx              # Componente do modelo 3D interativo
│   ├── Features.tsx             # Seção de características
│   ├── Products.tsx             # Seção de produtos
│   ├── ProductCard.tsx          # Card individual de produto
│   ├── About.tsx                # Seção sobre a empresa
│   ├── Contact.tsx              # Seção de contato com formulário
│   └── Footer.tsx               # Rodapé com links e informações
│
├── lib/                          # Utilitários e configurações
│   ├── gsap.ts                  # Configuração do GSAP
│   └── utils.ts                 # Funções utilitárias
│
├── public/                       # Assets estáticos
│   ├── snow-logo.png            # Logo principal
│   ├── snow-icon.png            # Ícone do site (favicon)
│   ├── snow.glb                 # Modelo 3D do snowflake
│   └── hero-bg.webp             # Background da hero section
│
├── next.config.js               # Configuração do Next.js
├── tailwind.config.ts           # Configuração do Tailwind CSS
├── tsconfig.json                # Configuração do TypeScript
├── postcss.config.js            # Configuração do PostCSS
├── package.json                 # Dependências do projeto
└── README.md                    # Este arquivo
```

## 🎯 Funcionalidades Implementadas

### Header
- ✅ Header fixo com efeito de scroll
- ✅ Navegação suave entre seções
- ✅ Menu ativo com indicador visual
- ✅ Logo com animação de entrada e hover
- ✅ Menu mobile responsivo
- ✅ Botão CTA "Ver Produtos"
- ✅ Iluminação sutil ao scrollar
- ✅ Ícones nos itens de navegação

### Hero Section
- ✅ Headline com gradiente e hierarquia visual
- ✅ Subheadline com contraste otimizado
- ✅ Botões CTA com efeitos hover avançados
- ✅ Stats com ícones e animações
- ✅ **Modelo 3D interativo** (snowflake) com Three.js
- ✅ Rotação automática lenta do modelo 3D
- ✅ Interação com drag and drop no modelo 3D
- ✅ Retorno suave à posição inicial após interação
- ✅ Glows rotativos animados atrás do modelo 3D
- ✅ Background image com opacidade baixa
- ✅ Animações de entrada para todos os elementos
- ✅ Shape divider SVG na parte inferior
- ✅ Scroll indicator centralizado na curva

### Features Section
- ✅ Cards de características com ícones
- ✅ Animações de entrada com ScrollTrigger
- ✅ Efeitos hover avançados
- ✅ Grid responsivo (1-2-3 colunas)

### Products Section
- ✅ Grid de produtos responsivo
- ✅ Cards minimalistas e elegantes
- ✅ Sistema de favoritos
- ✅ Links para produtos no Mercado Livre
- ✅ Animações de entrada

### About Section
- ✅ Seção sobre a empresa
- ✅ Layout responsivo
- ✅ Animações de entrada

### Contact Section
- ✅ Formulário de contato funcional
- ✅ Cards de informação de contato
- ✅ Links para redes sociais
- ✅ Integração com WhatsApp, Instagram e Facebook
- ✅ Validação de formulário
- ✅ Animações de entrada

### Footer
- ✅ Rodapé completo com links
- ✅ Informações da empresa
- ✅ Links para redes sociais
- ✅ Copyright dinâmico

### Efeitos Visuais
- ✅ Gradientes personalizados
- ✅ Glows e brilhos animados
- ✅ Transições suaves
- ✅ Hover effects avançados
- ✅ Scrollbar personalizada
- ✅ Background com gradientes e glows
- ✅ Shape dividers entre seções

### Performance e UX
- ✅ Lazy loading de componentes 3D
- ✅ Otimização de imagens (Next.js Image)
- ✅ Smooth scroll entre seções
- ✅ Animações otimizadas com GSAP
- ✅ Responsividade total
- ✅ Acessibilidade básica

## 🎮 Modelo 3D Interativo

O projeto inclui um modelo 3D interativo de um snowflake renderizado com Three.js:

### Características:
- **Formato**: GLB (formato binário otimizado)
- **Rotação Automática**: Gira lentamente quando não está sendo interagido
- **Interatividade**: Pode ser arrastado e rotacionado pelo usuário
- **Retorno Suave**: Retorna suavemente à posição inicial após soltar
- **Iluminação**: Sistema de iluminação customizado para dark mode
- **Performance**: Renderização otimizada com @react-three/fiber

### Controles:
- **Mouse/Touch**: Arraste para rotacionar o modelo
- **Auto-rotacião**: Retoma automaticamente após soltar

## 🚀 Deploy no Vercel

### Deploy Automático

1. **Conectar Repositório**
   - Faça push do código para o GitHub
   - Conecte o repositório ao Vercel

2. **Configuração**
   - O Vercel detectará automaticamente o Next.js
   - Configure as variáveis de ambiente (se necessário)
   - Ajuste as configurações de build se necessário

3. **Deploy**
   - O deploy será feito automaticamente a cada push
   - O Vercel gerencia o build e o deploy

### Deploy Manual

```bash
# 1. Build do projeto
npm run build

# 2. Instalar Vercel CLI (se necessário)
npm i -g vercel

# 3. Deploy
vercel
```

## 🔧 Configurações Importantes

### Next.js Config
- **Image Domains**: Configurado para Mercado Livre
- **Webpack**: Configurado para suportar Three.js (canvas externo)
- **React Strict Mode**: Habilitado

### Tailwind Config
- **Paleta de Cores**: Cores customizadas da paleta do projeto
- **Box Shadows**: Sombras personalizadas com opacidades ajustadas
- **Animations**: Animações customizadas (float, rotate-glow)

### TypeScript Config
- **Strict Mode**: Habilitado
- **Paths**: Configurado para imports com `@/`
- **Types**: Tipos para Node.js, React e Three.js

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint
```

## 🎨 Customizações

### Cores
As cores podem ser personalizadas em:
- `tailwind.config.ts` - Paleta de cores do Tailwind
- `app/globals.css` - Variáveis CSS e estilos globais

### Animações
As animações podem ser ajustadas em:
- `components/*.tsx` - Componentes individuais
- `lib/gsap.ts` - Configuração global do GSAP

### Modelo 3D
O modelo 3D pode ser substituído:
- Substitua `public/snow.glb` pelo seu modelo
- Ajuste a escala e posição em `components/Model3D.tsx`

## 📄 Metadados e SEO

O projeto inclui metadados otimizados:
- **Title**: "SNW STORE - Revendas dos Melhores Produtos"
- **Description**: Descrição otimizada para SEO
- **Keywords**: Palavras-chave relevantes
- **Favicon**: Ícone personalizado (snow-icon.png)

## 🔮 Próximos Passos

### Funcionalidades Futuras
- [ ] Integração com API do Mercado Livre
- [ ] Banco de dados para produtos (Prisma + PostgreSQL/MySQL)
- [ ] Sistema de busca e filtros
- [ ] Paginação de produtos
- [ ] Painel administrativo
- [ ] Sistema de autenticação
- [ ] Carrinho de compras
- [ ] Checkout integrado
- [ ] Sistema de avaliações
- [ ] Blog/Notícias
- [ ] Analytics e tracking
- [ ] PWA (Progressive Web App)

### Melhorias Técnicas
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Playwright)
- [ ] Otimização de imagens avançada
- [ ] Cache estratégico
- [ ] Internacionalização (i18n)
- [ ] Dark/Light mode toggle
- [ ] Performance monitoring

## 📄 Licença

Este projeto é privado e de uso exclusivo.

## 👥 Contribuições

Este é um projeto privado. Para sugestões ou melhorias, entre em contato com os mantenedores.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato através do formulário no site
- Email: contato@snow.com.br

---

**Desenvolvido com ❤️ para SNW STORE**
