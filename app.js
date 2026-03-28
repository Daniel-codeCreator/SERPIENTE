        let canvas;
        let ctx;
        let gridSize = 20;
        let snake = [{ x: 200, y: 200 }];
        let apple = { x: 0, y: 0 };
        let dx = gridSize;
        let dy = 0;
        let score = 0;
        let maxScore = 0;
        let isGameOver = false;
        let gameSpeed = 100; // Velocidad predeterminada (medio)
        let selectedLevel = '';
        let gameLoopId;
        let isPaused = false;

        // Función para generar una nueva manzana
        function generateApple() {
            apple.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
            apple.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        }

        // Función principal del juego
        function gameLoop() {
            if (isGameOver || isPaused) return; // Detener el juego si ya perdió o está pausado

            // Mover la serpiente
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Verificar colisión con los bordes
            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
                endGame();
                return;
            }

            // Verificar colisión con la propia serpiente
            if (isSnakeCollision(head)) {
                endGame();
                return;
            }

            snake.unshift(head);

            // Comprobar si la serpiente come una manzana
            if (head.x === apple.x && head.y === apple.y) {
                score++;
                if (score >= maxScore) {
                    endGame(true); // Llama a endGame con la condición de victoria
                    return;
                }
                generateApple();
            } else {
                snake.pop();
            }

            // Dibujar el fondo y la serpiente
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'blue';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            });

            // Dibujar la manzana
            ctx.fillStyle = 'red';
            ctx.fillRect(apple.x, apple.y, gridSize, gridSize);

            // Mostrar puntaje
            document.getElementById('scoreDisplay').textContent = `Score: ${score}`;

            // Continuar el bucle del juego
            gameLoopId = setTimeout(gameLoop, gameSpeed);
        }

        // Función para verificar colisión con la serpiente
        function isSnakeCollision(head) {
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        }
       

        // Función para finalizar el juego
        function endGame(isWin = false) {
            isGameOver = true;
            clearTimeout(gameLoopId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.font = '24px Comic Sans';
            ctx.fillText(isWin ? '¡GANASTE!' : 'PERDISTE JAJA', canvas.width / 2, canvas.height / 2);
            document.getElementById('gameOverScreen').style.display = 'block';
        }

        // Función para reiniciar el juego
        function restartGame() {
            isGameOver = false;
            snake = [{ x: 200, y: 200 }];
            dx = gridSize;
            dy = 0;
            score = 0;
            generateApple();
            document.getElementById('gameOverScreen').style.display = 'none';
            gameLoop();
        }

        // Función para volver al menú de selección de nivel
        function returnToMenu() {
            isGameOver = true;
            document.getElementById('levelSelection').style.display = 'flex';
            document.getElementById('gameCanvas').style.display = 'none';
            document.getElementById('gameOverScreen').style.display = 'none';
        }

        // Función para iniciar el juego con el nivel seleccionado
        function startGame(level) {
            selectedLevel = level;
            canvas = document.getElementById('gameCanvas');
            ctx = canvas.getContext('2d');
            canvas.style.display = 'block';
            document.getElementById('levelSelection').style.display = 'none';

            // Mostrar el nivel seleccionado
            document.getElementById('scoreDisplay').textContent = `Nivel: ${selectedLevel.toUpperCase()}`;
            

            // Establecer la velocidad y puntaje máximo según el nivel seleccionado
            if (level === 'easy') {
                maxScore = 100;
                gameSpeed = 100; // Fácil
            } else if (level === 'medium') {
                maxScore = 150;
                gameSpeed = 75; // Medio
            } else if (level === 'hard') {
                maxScore = 200;
                gameSpeed = 50; // Difícil
            }

            // Capturar eventos de teclado para controlar la serpiente
            document.addEventListener('keydown', handleKeyDown);

            // Reiniciar el juego
            snake = [{ x: 200, y: 200 }];
            dx = gridSize;
            dy = 0;
            score = 0;
            isGameOver = false;
            generateApple();
            gameLoop();

            document.getElementById('maxScoreDisplay').textContent = `Máximo: ${maxScore}`;
            
        }

        // Función para manejar eventos de teclado y controlar la dirección de la serpiente
        function handleKeyDown(event) {
            if (isGameOver) return;

            switch (event.key) {
                case 'ArrowUp':
                    if (dy !== gridSize) {
                        dx = 0;
                        dy = -gridSize;
                    }
                    break;
                case 'ArrowDown':
                    if (dy !== -gridSize) {
                        dx = 0;
                        dy = gridSize;
                    }
                    break;
                case 'ArrowLeft':
                    if (dx !== gridSize) {
                        dx = -gridSize;
                        dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (dx !== -gridSize) {
                        dx = gridSize;
                        dy = 0;
                    }
                    break;
            }
        }

        // Función para pausar/reanudar el juego
        function togglePause() {
            isPaused = !isPaused;

            if (isPaused) {
                // Juego pausado
                clearTimeout(gameLoopId); // Detener el bucle del juego
            } else {
                // Reanudar el juego
                gameLoop(); // Reiniciar el bucle del juego
            }
        }

        // Capturar eventos de teclado para pausar/reanudar con la barra espaciadora
        document.addEventListener('keydown', event => {
            if (event.code === 'Space') {
                togglePause();
            }
});