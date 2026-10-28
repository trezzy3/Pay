// Catálogo de Produtos Oficiais da Trezzy 3D (Sem itens de vídeo)
const PRODUCTS_DATA = [
  {
    id: 'letra-personalizada-alice',
    name: 'Letra Decorativa 3D Personalizada com Nome (Ex: Alice)',
    category: 'decoracao',
    categoryName: 'Decoração & Nomes Personalizados',
    price: 42.90,
    pixPrice: 38.61,
    badge: 'Personalizado',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bgTheme: 'white',
    image: 'assets/produto_letra_alice.png',
    rating: 5.0,
    reviewsCount: 34,
    shortDesc: 'Letra inicial com nome vazado em sobreposição. Perfeita para quartos infantis, maternidade e festas.',
    fullDesc: 'Produzida com acabamento refinado e bordas suaves, essa peça decorativa para em pé sozinha sobre qualquer superfície plana (mesa, nicho ou estante). Personalizamos com qualquer letra inicial e o nome que desejar! Basta informar o nome após o pedido.',
    specs: {
      material: 'PLA Premium Atóxico com cores pasteis ou vibrantes',
      dimensoes: 'Aprox. 12 cm altura x 10 cm largura x 1,8 cm espessura',
      estabilidade: 'Fica perfeitamente em pé sem necessidade de suporte',
      personalizacao: 'Qualquer letra e nome de sua escolha'
    },
    colors: ['Lilás Lavanda Pastel', 'Rosa Bebê', 'Azul Céu', 'Branco Puro', 'Dourado Metálico']
  },
  {
    id: 'casal-coracao-silhueta',
    name: 'Escultura Silhueta Casal Apaixonado no Coração com Base',
    category: 'decoracao',
    categoryName: 'Decoração Romântica & Presentes',
    price: 49.90,
    pixPrice: 44.91,
    badge: 'Romântico',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    bgTheme: 'white',
    image: 'assets/produto_casal_coracao.png',
    rating: 5.0,
    reviewsCount: 28,
    shortDesc: 'Silhueta minimalista de casal abraçado formando uma moldura em coração. Presente marcante para namorados e casamentos.',
    fullDesc: 'Uma escultura que transmite carinho e cumplicidade com traços elegantes. Feita em contraste escuro de alta definição apoiada em base retangular estável. Perfeita para decorar mesas de cabeceira, salas de estar ou presentear em aniversários de namoro/casamento.',
    specs: {
      material: 'PLA Silk / Fosco de alta resolução',
      dimensoes: '18 cm altura x 16 cm largura total',
      base: 'Base retangular ponderada para máxima estabilidade',
      acabamento: 'Bordas finas com corte milimétrico'
    },
    colors: ['Preto Fosco Stealth', 'Dourado Imperial', 'Branco Acetinado', 'Bronze Rústico']
  },
  {
    id: 'kit-quadros-gatos-parede',
    name: 'Kit Quadros Vazados de Parede Silhueta Gatos & Borboleta (2 Peças)',
    category: 'decoracao',
    categoryName: 'Decoração de Parede & Pet Lovers',
    price: 58.90,
    pixPrice: 53.01,
    badge: 'Kit 2 Peças',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bgTheme: 'white',
    image: 'assets/produto_quadros_gatos.png',
    rating: 4.9,
    reviewsCount: 41,
    shortDesc: 'Conjunto de 2 molduras vazadas com gatinhos e borboleta. Fixação fácil sem furar a parede.',
    fullDesc: 'Transforme qualquer parede comum em um espaço aconchegante e cheio de personalidade pet! O kit inclui duas molduras vazadas complementares com silhuetas de gatinhos e uma borboleta solta para compor na parede. Acompanha fita dupla face própria para fixação limpa sem pregos.',
    specs: {
      material: 'PLA de Alta Densidade resistente e super leve',
      incluso: '2 Molduras vazadas (20x15cm cada) + 1 Borboleta decorativa',
      fixacao: 'Fita dupla face inclusa (não necessita furos)',
      idealPara: 'Salas, corredores, quartos e clínicas veterinárias'
    },
    colors: ['Preto Fosco (Black Edition)', 'Branco Minimalista', 'Dourado Nobre']
  },
  {
    id: 'vaso-cachepo-gatinho',
    name: 'Vaso Cachepô Gatinho Dorminhoco para Suculentas e Porta-Trecos',
    category: 'decoracao',
    categoryName: 'Decoração & Vasos Criativos',
    price: 39.90,
    pixPrice: 35.91,
    badge: 'Mais Fofo',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bgTheme: 'white',
    image: 'assets/produto_vaso_gatinho.png',
    rating: 5.0,
    reviewsCount: 26,
    shortDesc: 'Gatinho esculpido deitado de barriga para cima segurando o vasinho com as quatro patinhas.',
    fullDesc: 'O vasinho mais charmoso da sua casa! Um gatinho esculpido com pelos e feições serenas segurando um vaso com pegadinhas e corações em relevo. Perfeito para pequenas suculentas, cactos ou para organizar clipes, joias e doces na mesa de trabalho.',
    specs: {
      material: 'PLA Premium com textura sedosa',
      dimensoes: '12 cm comprimento x 8 cm largura x 7 cm altura',
      bocalVaso: '6 cm diâmetro interno',
      aplicacao: 'Mini plantas, suculentas artificiais/naturais ou porta-joias'
    },
    colors: ['Preto Acetinado', 'Branco Pérola', 'Cinza Chumbo', 'Terracota']
  },
  {
    id: 'coracao-teamo-mesa',
    name: 'Escultura de Mesa Coração "Te Amo" em Relevo 3D',
    category: 'decoracao',
    categoryName: 'Decoração Romântica & Lembrancinhas',
    price: 29.90,
    pixPrice: 26.91,
    badge: 'Lembrancinha',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    bgTheme: 'white',
    image: 'assets/produto_coracao_teamo.png',
    rating: 4.9,
    reviewsCount: 19,
    shortDesc: 'Coração vazado tridimensional com inscrição "Te Amo" cursiva na base para mesa.',
    fullDesc: 'Lembrança encantadora para surpreender quem você ama. A palavra "Te Amo" integra a própria estrutura inferior do coração, permitindo que a peça pare em pé com solidez sobre escrivaninhas, prateleiras ou bandejas de café da manhã.',
    specs: {
      material: 'PLA ecológico atóxico',
      dimensoes: '10 cm altura x 10 cm largura x 2 cm profundidade',
      estabilidade: 'Equilíbrio autônomo sem tombamento',
      ocasioes: 'Dia dos Namorados, Aniversários, Pedidos de Casamento'
    },
    colors: ['Preto Fosco', 'Vermelho Paixão', 'Dourado Silk', 'Rosa Chiclete']
  },
  {
    id: 'carimbos-doces-kit4',
    name: 'Kit Carimbos para Brigadeiros e Doces (4 peças)',
    category: 'confeitaria',
    categoryName: 'Confeitaria & Doces',
    price: 34.90,
    pixPrice: 31.41,
    badge: 'Mais Vendido',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bgTheme: 'warm',
    image: 'assets/produto_carimbos.png',
    rating: 5.0,
    reviewsCount: 38,
    shortDesc: 'Carimbos ergonômicos com relevo nítido de flores, borboleta e coração para doces gourmet.',
    fullDesc: 'Eleve o padrão das suas encomendas com o Kit de Carimbos Trezzy 3D! Especialmente desenvolvido para brigadeiros de 15g a 25g, doces finos, pasta americana e biscoitos. Proporciona marcações profundas e nítidas com esforço mínimo, valorizando o produto final e aumentando sua margem de lucro.',
    specs: {
      material: 'PLA Premium Atóxico (Food Safe)',
      dimensoes: 'Carimbo: 2,5 cm diâmetro x 4 cm altura',
      resolucao: 'Camadas de 0.16mm para ultra-definição',
      cuidados: 'Lavar em água corrente com sabão neutro. Não expor ao calor excessivo.'
    },
    colors: ['Bege Natural / Marfim', 'Rosa Bebê', 'Dourado Metálico']
  },
  {
    id: 'quadro-3d-coracao',
    name: 'Escultura & Quadro 3D Coração Anatômico com Moldura de Mesa',
    category: 'decoracao',
    categoryName: 'Decoração & Arte 3D',
    price: 79.90,
    pixPrice: 71.91,
    badge: 'Exclusivo',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bgTheme: 'dark',
    image: 'assets/produto_quadro_coracao.png',
    rating: 5.0,
    reviewsCount: 16,
    shortDesc: 'Arte tridimensional rica em detalhes anatômicos com base suspensa elegante.',
    fullDesc: 'Uma verdadeira obra de arte contemporânea. O coração anatômico possui precisão cirúrgica de detalhes (veias, ventrículos e artérias esculpidas em 3D), repousando em uma moldura flutuante geométrica perfeita para estantes, consultórios médicos, clínicas ou escritórios de design.',
    specs: {
      material: 'PLA Silk Dourado / Branco Mármore',
      dimensoes: 'Moldura: 18cm x 13cm x 6cm',
      resolucao: 'Ultra High Detail (0.12mm)',
      aplicacao: 'Decoração de mesa, estante ou presente sofisticado'
    },
    colors: ['Dourado Imperial & Base Preta', 'Branco Mármore & Base Ouro', 'Terracota Artesanal']
  }
];
