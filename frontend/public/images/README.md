# Instruções para adicionar o Brasão

Para adicionar seu próprio brasão ao UFRA Notes, siga estas instruções:

1. Salve sua imagem do brasão com o nome `brasao-ufra.png` nesta pasta (`/public/images/`)
2. Para melhor resultado, use uma imagem com fundo transparente (formato PNG)
3. Dimensões recomendadas: 400x400 pixels
4. O sistema aplicará automaticamente um efeito de brilho neon na cor principal do tema

## Personalização Adicional

Se quiser mudar o nome do arquivo ou as dimensões do brasão, você pode editar o arquivo:
`src/components/layouts/MainLayout.js`

Procure pela seção:

```jsx
<LogoArea>
  {/* Insira sua imagem aqui */}
  <img src="/images/brasao-ufra.png" alt="Brasão UFRA" />
</LogoArea>
```

E altere o atributo `src` para o caminho da sua imagem. 