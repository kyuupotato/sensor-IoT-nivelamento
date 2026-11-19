# Nível Digital

Aplicativo demonstrativo em React Native + Expo que utiliza o acelerômetro do smartphone.

## Estrutura

```text
Nivel_Digital/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
└── README.md
```

## Como adicionar ao seu projeto Expo Router existente

1. Abra a pasta do seu projeto.
2. Instale o pacote do sensor:

   ```bash
   npx expo install expo-sensors
   ```

3. Copie a pasta `app` deste projeto para o seu projeto. Se já existir uma pasta `app`, copie/substitua os arquivos `index.tsx` e `_layout.tsx` (faça backup do seu layout anterior se ele tiver outras configurações).
4. Inicie o projeto:

   ```bash
   npx expo start
   ```

5. Leia o QR Code com o Expo Go em um smartphone físico.

## Criar um projeto novo

Se ainda não tiver um projeto Expo Router, crie um com:

```bash
npx create-expo-app@latest NivelDigital
cd NivelDigital
npx expo install expo-sensors
```

Depois, substitua/adicione os arquivos da pasta `app` pelos arquivos deste pacote e execute `npx expo start`.

## Observações

- O acelerômetro pode não funcionar no navegador ou em alguns emuladores. Prefira testar em um celular físico.
- Os ângulos e o critério de nivelamento são estimativas didáticas. Para medições precisas, seria necessário calibrar o sensor e melhorar o tratamento dos dados.
- O projeto usa Expo Router, por isso os arquivos ficam dentro da pasta `app`.