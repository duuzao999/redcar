// Variáveis do carro do jogador
let carroX, carroY;
let carroLargura = 40;
let carroAltura = 70;
let carroImg;

// Variáveis dos obstáculos
let obstaculos = [];
let obstaculoLargura = 40;
let obstaculoAltura = 70;
let obstaculoVelBase = 5; // Velocidade inicial dos obstáculos
let obstaculoVelAtual;
let tiposDeObstaculos = ["normal", "zigzag", "lateral"];

// Pontuação e níveis
let pontuacao = 0;
let nivel = 1;

// Variáveis do jogo
let jogoAtivo = true;

// Função para carregar imagens
function preload() {
  carroImg = loadImage("carro.png"); // Imagem do carro do jogador
  obstaculoImg = loadImage("cat.png"); // Imagem do obstáculo
}

function setup() {
  createCanvas(400, 600);

  // Inicializar posição do carro do jogador
  carroX = width / 2 - carroLargura / 2;
  carroY = height - carroAltura - 20;

  // Inicializar velocidade atual dos obstáculos
  obstaculoVelAtual = obstaculoVelBase;
}

function draw() {
  if (jogoAtivo) {
    background(30);

    // Desenhar a pista
    desenharPista();

    // Mostrar pontuação e nível
    fill(255);
    textSize(24);
    textAlign(LEFT);
    text(`Pontuação: ${pontuacao}`, 10, 30);
    text(`Nível: ${nivel}`, 10, 60);

    // Desenhar o carro do jogador
    image(carroImg, carroX, carroY, carroLargura, carroAltura);

    // Controle do carro
    if (keyIsDown(LEFT_ARROW) && carroX > 0) {
      carroX -= 5;
    }
    if (keyIsDown(RIGHT_ARROW) && carroX < width - carroLargura) {
      carroX += 5;
    }

    // Gerar obstáculos
    if (frameCount % 60 === 0) {
      let obstaculoX = random(0, width - obstaculoLargura);
      let tipo = random(tiposDeObstaculos);
      obstaculos.push({ x: obstaculoX, y: -obstaculoAltura, tipo, direcao: random([-1, 1]) });
    }

    // Atualizar obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
      let obstaculo = obstaculos[i];

      // Movimento baseado no tipo de obstáculo
      if (obstaculo.tipo === "normal") {
        obstaculo.y += obstaculoVelAtual;
      } else if (obstaculo.tipo === "zigzag") {
        obstaculo.y += obstaculoVelAtual;
        obstaculo.x += obstaculo.direcao * 3; // Movimento lateral em zigue-zague
        if (obstaculo.x <= 0 || obstaculo.x >= width - obstaculoLargura) {
          obstaculo.direcao *= -1;
        }
      } else if (obstaculo.tipo === "lateral") {
        obstaculo.x += obstaculo.direcao * obstaculoVelAtual; // Movimento horizontal
        if (obstaculo.x <= 0 || obstaculo.x >= width - obstaculoLargura) {
          obstaculo.direcao *= -1;
        }
      }

      // Desenhar obstáculo
      image(obstaculoImg, obstaculo.x, obstaculo.y, obstaculoLargura, obstaculoAltura);

      // Verificar colisão
      if (
        carroX < obstaculo.x + obstaculoLargura &&
        carroX + carroLargura > obstaculo.x &&
        carroY < obstaculo.y + obstaculoAltura &&
        carroY + carroAltura > obstaculo.y
      ) {
        jogoAtivo = false;
      }

      // Remover obstáculos fora da tela
      if (obstaculo.y > height) {
        obstaculos.splice(i, 1);
        pontuacao++;
      }
    }

    // Atualizar nível e velocidade
    atualizarNivel();
  } else {
    // Tela de fim de jogo
    background(0);
    fill(255, 0, 0);
    textSize(36);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2 - 20);
    textSize(24);
    text(`Pontuação final: ${pontuacao}`, width / 2, height / 2 + 20);
    textSize(20);
    text("Pressione R para reiniciar", width / 2, height / 2 + 60);

    if (keyIsDown(82)) { // R
      reiniciarJogo();
    }
  }
}

function desenharPista() {
  fill(100);
  rect(50, 0, width - 100, height); // Pista

  // Linhas centrais
  stroke(255);
  strokeWeight(4);
  for (let i = 0; i < height; i += 40) {
    line(width / 2, i, width / 2, i + 20);
  }
  noStroke();
}

function atualizarNivel() {
  // Aumenta o nível e a velocidade a cada 10 pontos
  let novoNivel = floor(pontuacao / 10) + 1;
  if (novoNivel > nivel) {
    nivel = novoNivel;
    obstaculoVelAtual += 1; // Aumenta a velocidade dos obstáculos

    // Adiciona novos tipos de obstáculos a partir de certos níveis
    if (nivel >= 3 && !tiposDeObstaculos.includes("zigzag")) {
      tiposDeObstaculos.push("zigzag");
    }
    if (nivel >= 5 && !tiposDeObstaculos.includes("lateral")) {
      tiposDeObstaculos.push("lateral");
    }
  }
}

function reiniciarJogo() {
  // Reiniciar variáveis do jogo
  jogoAtivo = true;
  carroX = width / 2 - carroLargura / 2;
  carroY = height - carroAltura - 20;
  obstaculos = [];
  pontuacao = 0;
  nivel = 1;
  obstaculoVelAtual = obstaculoVelBase;
  tiposDeObstaculos = ["normal"];
}
